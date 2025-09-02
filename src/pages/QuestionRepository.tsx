import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { Link } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Filter,
  Database,
  Brain,
  TrendingUp,
  Users,
  Eye,
  Edit,
  Trash2,
  Download,
  FileText,
} from "lucide-react";
import { getFromDB } from "@/api";
import { deleteQuestion, fetchDropdownOptions, getLearningObjectives, getChapters } from "@/api";
import { updateQuestion } from "@/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

const QuestionRepository = () => {
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewQuestion, setPreviewQuestion] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editQuestion, setEditQuestion] = useState<any>(null);
  const [questionTypes, setQuestionTypes] = useState<string[]>([]);
  // Always default to "0" (All) for Question Type on navigation
  const [selectedQuestionType, setSelectedQuestionType] = useState(() => "0");
  const [taxonomyList, setTaxonomyList] = useState<string[]>([]);
  const [selectedTaxonomy, setSelectedTaxonomy] = useState(() =>
    localStorage.getItem("selectedTaxonomy") || "0"
  );
  const [dropdownError, setDropdownError] = useState<string>("");
  // --- Study Domain (Chapter) ---
  const [chapters, setChapters] = useState<any[]>([]);
  // Always default to "0" (All) for Study Domain (Chapter) on navigation
  const [selectedChapter, setSelectedChapter] = useState(() => "0");
  const [chaptersLoading, setChaptersLoading] = useState(false);
  const [chaptersError, setChaptersError] = useState<string>("");

  // --- Learning Objective (LO) ---
  const [learningObjectives, setLearningObjectives] = useState<any[]>([]);
  // Always default to "0" (All) for Learning Objective on navigation
  const [selectedLO, setSelectedLO] = useState(() => "0");
  const [loLoading, setLoLoading] = useState(false);
  const [loError, setLoError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const statsData = [
    {
      title: "Total Questions",
      value: "1,247",
      change: "+15% this month",
      icon: Database,
      valueColor: "#1c398e",
    },
    {
      title: "AI Generated",
      value: "892",
      change: "High quality",
      icon: Brain,
      valueColor: "#0d542b",
    },
    {
      title: "This Week",
      value: "47",
      change: "New questions",
      icon: TrendingUp,
      valueColor: "#59168b",
    },
    {
      title: "Contributors",
      value: "12",
      change: "Active authors",
      icon: Users,
      valueColor: "#7e2a0c",
    },
  ];

  const clearFilters = () => {
    setSelectedQuestionType("");
    setSelectedTaxonomy("");
    setSelectedLO("");
    localStorage.removeItem("selectedQuestionType");
    localStorage.removeItem("selectedTaxonomy");
    localStorage.removeItem("selectedLO");
  };

  type Question = {
    id: string;
    question?: string;
    type?: string;
    topic?: string;
    difficulty?: string;
    created?: string;
    questionrequestid?: string;
    [key: string]: any;
  };

  const [questions, setQuestions] = useState<Question[]>([]);
  const [searchText, setSearchText] = useState("");
  // Expose fetchData so it can be called after delete
  const fetchData = async (filters?: {
    searchText?: string;
    chapterCode?: string;
    questionType?: string;
    taxonomy?: string;
    learningObjective?: string;
  }) => {
    setLoading(true);
    let usercode = "";
    let custcode = "";
    let orgcode = "";
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}") || {};
      usercode = userInfo.userCode || "";
      custcode = userInfo.custCode || "";
      orgcode = userInfo.orgCode || "";
    } catch (e) {
      usercode = "";
      custcode = "";
      orgcode = "";
    }
    // Only include filters if not "All" (value "0" or empty string)
    const chaptercode = filters?.chapterCode && filters.chapterCode !== "0" ? filters.chapterCode : "";
    const questiontypeid = filters?.questionType && filters.questionType !== "0" ? filters.questionType : 0;
    const taxonomyid = filters?.taxonomy && filters.taxonomy !== "0" ? filters.taxonomy : 0;
    const locode = filters?.learningObjective && filters.learningObjective !== "0" ? filters.learningObjective : "";
    // booknameid should be a number, fallback to 0 if not available or not a number
    let booknameidRaw = localStorage.getItem("bookType") || "";
    let booknameid: number = 0;
    if (booknameidRaw && !isNaN(Number(booknameidRaw))) {
      booknameid = Number(booknameidRaw);
    }
    const input = {
      custcode: custcode || "ES",
      orgcode: orgcode,
      usercode: usercode,
      appcode: localStorage.getItem("appcode") || "", // Default to "IG" if not set
      booknameid: booknameid,
      chaptercode: chaptercode,
      locode: locode,
      questiontypeid: typeof questiontypeid === 'string' ? Number(questiontypeid) : questiontypeid,
      taxonomyid: typeof taxonomyid === 'string' ? Number(taxonomyid) : taxonomyid,
      difficultlevelid: 0,
      questionrequestid: 0,
      questionid: 1,
      sourcetype: 0,
      pagesize: 0,
      pageno: 0,
      usertypeid: 1,
      searchtext: filters?.searchText !== undefined ? filters.searchText : searchText,
    };

    try {
      const data = await getFromDB(input);
      console.log('[QuestionRepository] getFromDB response:', data);
      if (data && data.question_xml) {
        console.log('[QuestionRepository] question_xml:', data.question_xml);
      }
      let questionsArr: Question[] = [];
      // Try to handle both array-of-arrays and array-of-objects
      if (data && Array.isArray(data.question_xml)) {
        if (data.question_xml.length > 0 && Array.isArray(data.question_xml[0])) {
          // Array of arrays (old logic)
          questionsArr = data.question_xml
            .map((item: any) => {
              if (
                Array.isArray(item) &&
                item.length >= 11 &&
                typeof item[2] === "object"
              ) {
                return {
                  id: item[7] || item[0], // string ID for UI
                  numericId: item[0], // numeric ID for API
                  questionrequestid: item[1],
                  question: item[2]?.label ?? "No question text",
                  type: item[6] ?? "Multiple Choice",
                  topic: item[12] ?? item[11] ?? "Unknown",
                  difficulty: item[15] ?? "Easy",
                  created: "N/A",
                  ...item[2],
                };
              }
              return null;
            })
            .filter(Boolean);
        } else if (typeof data.question_xml[0] === "object") {
          // Array of objects (new logic)
          questionsArr = data.question_xml.map((item: any) => ({
            id: item.id || item.questionid || item.questionId || Math.random().toString(36).slice(2),
            numericId: item.questionid || item.questionId || item.id || null,
            questionrequestid: item.questionrequestid || item.questionRequestId || "",
            question: item.label || item.question || item.stem || "No question text",
            type: item.type || item.questiontype || "Multiple Choice",
            topic: item.topic || item.topicname || "Unknown",
            difficulty: item.difficulty || item.difficultylevel || "Easy",
            created: item.created || item.createdAt || "N/A",
            ...item,
          }));
        }
      }
      setQuestions(questionsArr);
      if (!questionsArr.length) {
        setError("No questions found.");
      } else {
        setError(null);
      }
    } catch (err) {
      setError("Failed to load questions");
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  // Optional: Manual refresh button for user
  // Place this in the UI where appropriate if desired

  useEffect(() => {
    // Ensure localStorage has custcode, orgcode, appcode for dropdown API
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}") || {};
      if (userInfo.custCode) localStorage.setItem("custcode", userInfo.custCode);
      if (userInfo.orgCode) localStorage.setItem("orgcode", userInfo.orgCode);
      localStorage.setItem("appcode", "IG");
    } catch { }

    // Fetch dropdowns for taxonomy and question type
    const fetchDropdowns = async () => {
      try {
        const data = await fetchDropdownOptions();
        let taxonomy: string[] = [];
        let qtypes: string[] = [];
        data.forEach((item: any) => {
          let parsed = [];
          try {
            parsed = JSON.parse(item.jsonDetails);
          } catch (e) {
            parsed = [];
          }
          if (item.type === "taxonomy") {
            taxonomy = parsed.map((t: any) => t.taxonomy);
          }
          if (item.type === "QuestionType") {
            qtypes = parsed.map((q: any) => q.questiontype);
          }
        });
        setTaxonomyList(taxonomy);
        setQuestionTypes(qtypes);
        if (!taxonomy.length || !qtypes.length) {
          setDropdownError("Dropdown data missing. Please check API response.");
        } else {
          setDropdownError("");
        }
      } catch (error) {
        setTaxonomyList([]);
        setQuestionTypes([]);
        setDropdownError("Failed to load dropdowns.");
      }
    };
    fetchDropdowns();
  }, []);


  // Fetch chapters for Study Domain dropdown
  useEffect(() => {
    const loadChapters = async () => {
      setChaptersLoading(true);
      setChaptersError("");
      try {
        const result = await getChapters("2");
        if (Array.isArray(result) && result.length > 0) {
          setChapters(result);
          setSelectedChapter(() => {
            const stored = localStorage.getItem("selectedChapter");
            if (stored && result.some(ch => ch.chapterCode === stored)) return stored;
            // Always default to "0" (All) if no valid stored value
            return "0";
          });
        } else {
          setChapters([]);
          setSelectedChapter("0");
        }
      } catch (err) {
        setChaptersError("Failed to load chapters");
        setChapters([]);
        setSelectedChapter("0");
      } finally {
        setChaptersLoading(false);
      }
    };
    loadChapters();
  }, []);

  // Fetch LOs when selectedChapter changes
  useEffect(() => {
    if (!selectedChapter) {
      setLearningObjectives([]);
      setSelectedLO("");
      return;
    }
    setLoLoading(true);
    setLoError("");
    setLearningObjectives([]);
    setSelectedLO("");
    const chapterCode = selectedChapter.trim();
    getLearningObjectives(chapterCode)
      .then((result) => {
        setLearningObjectives(result);
        const stored = localStorage.getItem("selectedLO");
        if (stored && result.some(lo => lo.loCode === stored)) {
          setSelectedLO(stored);
        } else if (result.length > 0) {
          setSelectedLO(result[0].loCode || "");
        }
      })
      .catch(() => {
        setLoError("Failed to load learning objectives");
        setLearningObjectives([]);
        setSelectedLO("");
      })
      .finally(() => setLoLoading(false));
  }, [selectedChapter]);

  // Persist Study Domain (Chapter)
  useEffect(() => {
    if (selectedChapter) localStorage.setItem("selectedChapter", selectedChapter);
  }, [selectedChapter]);

  // Persist Learning Objective
  useEffect(() => {
    if (selectedLO) localStorage.setItem("selectedLO", selectedLO);
  }, [selectedLO]);

  const handleDelete = async (id: string, questionrequestid: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this question?");
    if (!confirmDelete) return;
    let usercode = "Adm488";
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}") || {};
      usercode = userInfo.userCode || "Adm488";
    } catch { }
    // Find the question object to get the numericId
    const q = questions.find(q => q.id === id);
    const questionid = q && q.numericId ? Number(q.numericId) : Number(id);
    const input = {
      questionid: questionid,
      questionrequestid: Number(questionrequestid),
      usercode: usercode,
    };
    const result = await deleteQuestion(input);
    if (result === true) {
      await fetchData(); // Refresh data from backend after delete
    } else {
      alert("❌ Failed to delete");
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };


  const handleSelectQuestion = (questionId: string) => {
    setSelectedQuestions((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  // Export to Word handler (updated: if any checkboxes selected, export only those from table; else, export all from localStorage.questionGenResults)
  const handleExportToWord = async () => {
    try {
      let results = [];
      if (selectedQuestions.length > 0) {
        // Export only selected questions from the table
        results = questions.filter(q => selectedQuestions.includes(q.id));
      } else {
        // Export all visible questions in the table (not localStorage)
        results = questions;
      }
      results = results.filter(Boolean);
      if (!results.length) {
        window.alert('No questions to export.');
        return;
      }
      // Get book title from localStorage, fallback to 'questions'
      let bookTitle = localStorage.getItem('bookTitle') || 'questions';
      // Clean filename: remove illegal characters and replace spaces with underscores
      bookTitle = bookTitle.replace(/[^a-zA-Z0-9-_ ]/g, '').replace(/\s+/g, '_');
      // Dynamically import docx
      const docx = await import('docx');
      const { Document, Packer, Paragraph, HeadingLevel } = docx;
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                text: 'Generated Questions',
                heading: HeadingLevel.HEADING_1
              }),
              ...results.map((q, idx) => {
                // Try to get options from q.values or q.options
                const options = Array.isArray(q.values) ? q.values : (Array.isArray(q.options) ? q.options : []);
                // Try to get correct answer
                const correctAnswer = q.CorrectAnswer || q.answer || (typeof q.correct === 'number' && options[q.correct]) || '';
                return [
                  new Paragraph({
                    text: `Question ${idx + 1}:`,
                    heading: HeadingLevel.HEADING_2
                  }),
                  new Paragraph(q.label || q.Question || q.text || q.QuestionText || ''),
                  ...(options.length > 0
                    ? [
                      new Paragraph('Options:'),
                      ...options.map((opt, i) => new Paragraph(`${String.fromCharCode(65 + i)}. ${opt}`)),
                      new Paragraph(`Correct Answer: ${correctAnswer}`)
                    ]
                    : [
                      new Paragraph(`Sample Answer: ${correctAnswer}`)
                    ]),
                  ...(q.LearningObjective ? [new Paragraph(`Learning Objective: ${q.LearningObjective}`)] : []),
                  ...(q.ReferenceInfo ? [new Paragraph(`Reference Info: ${q.ReferenceInfo}`)] : []),
                  ...(q.BookName ? [new Paragraph(`Book Name: ${q.BookName}`)] : []),
                  new Paragraph('')
                ];
              }).flat()
            ]
          }
        ]
      });
      const blob = await Packer.toBlob(doc);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${bookTitle}.docx`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (e) {
      window.alert('Failed to export to Word.');
    }
  };

  function handleGo() {
    fetchData({
      searchText,
      chapterCode: selectedChapter,
      questionType: selectedQuestionType,
      taxonomy: selectedTaxonomy,
      learningObjective: selectedLO,
    });
  }
  function handleSelectAll(questions: { [key: string]: any; id: string; question?: string; type?: string; topic?: string; difficulty?: string; created?: string; questionrequestid?: string; }[]): void {
    if (selectedQuestions.length === questions.length) {
      setSelectedQuestions([]);
    } else {
      setSelectedQuestions(questions.map(q => q.id));
    }
  }
  return (
    <div className="min-h-screen bg-background">
      {/* <AppSidebar /> */}

      <div className="pl-63">
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold">Question Repository</h1>

            </div>
            <div className="flex items-center gap-4">
              <Link to="/item-generation">
                <Button variant="ghost" size="sm" className="text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  Back to Knowledge Base
                </Button>
              </Link>
              <ProfileDropdown />
            </div>
          </div>
        </header>

        <main className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsData.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="border border-border/40">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-bold" style={{ color: stat.valueColor, fontSize: '1.25rem' }}>
                          {stat.value}
                        </p>
                        <p className="text-xs text-muted-foreground">{stat.change}</p>
                      </div>
                      <Icon className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Filters & Search */}
          <Card className="border border-border/40">
            <CardContent className="p-6">
              <div className="space-y-4">
                {dropdownError && <div className="text-xs text-red-500">{dropdownError}</div>}
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Filter className="h-4 w-4" />
                  Filters & Search
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Source Type */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Source Type</label>
                    <Select defaultValue="all-sources">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-sources">All</SelectItem>
                        <SelectItem value="book-based">Cyber Risk</SelectItem>
                        <SelectItem value="ai-generated">LLM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>


                  {/* Study Domain (Chapter) - Dynamic */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Study Domain</label>
                    <Select
                      value={selectedChapter}
                      onValueChange={val => setSelectedChapter(val)}
                      disabled={chaptersLoading || chapters.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={chaptersLoading ? "Loading..." : "Select study domain"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">All</SelectItem>
                        {chapters.map((ch) => (
                          <SelectItem key={ch.chapterCode} value={ch.chapterCode}>
                            {ch.chapterName || ch.chapterCode}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {chaptersError && <div className="text-xs text-red-500">{chaptersError}</div>}
                  </div>

                  {/* Learning Objective - Dynamic */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Learning Objective</label>
                    <Select
                      value={selectedLO}
                      onValueChange={val => setSelectedLO(val)}
                      disabled={loLoading || learningObjectives.length === 0 || !selectedChapter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={loLoading ? "Loading..." : (!selectedChapter ? "Select study domain first" : "All")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">All</SelectItem>
                        {learningObjectives.map((lo) => (
                          <SelectItem key={lo.loCode} value={lo.loCode}>
                            {lo.loName || lo.loCode}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {loError && <div className="text-xs text-red-500">{loError}</div>}
                  </div>

                  {/* Question Type */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Question Type</label>
                    <Select
                      value={selectedQuestionType}
                      onValueChange={(val) => {
                        setSelectedQuestionType(val);
                        localStorage.setItem("selectedQuestionType", val);
                      }}
                      disabled={questionTypes.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={questionTypes.length === 0 ? "No data" : "Select question type"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">All</SelectItem>
                        {questionTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Difficulty */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Difficulty</label>
                    <Select defaultValue="all-levels">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-levels">All Levels</SelectItem>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>




                  {/* Created By */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Created By</label>
                    <Select defaultValue="all-levels">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-levels">All </SelectItem>
                        <SelectItem value="easy">Me</SelectItem>
                        <SelectItem value="medium">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>


                {/* Search Bar */}
                <div className="grid grid-cols-0 md:grid-cols-4 gap-4 items-end">
                  <div className="space-y-2 md:col-span-3">
                    <label className="text-sm font-medium">Search</label>
                    <input
                      type="text"
                      className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter search text"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleGo(); }}
                    />
                  </div>
                  <div >
                    <Button onClick={handleGo}
                    >
                      Go
                    </Button>
                  </div>
                </div>


              </div>
            </CardContent>
          </Card>


          {/* Questions Table */}
          <Card className="border border-border/40">
            <CardContent className="p-0">
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{questions.length} Questions</span>
                  {error && <span className="text-xs text-red-500 ml-2">{error}</span>}
                </div>
                <div className="flex items-center gap-2">

                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700"
                    onClick={async () => {
                      if (selectedQuestions.length === 0) return alert("No questions selected");
                      if (!window.confirm("Are you sure you want to delete selected questions?")) return;
                      let successCount = 0;
                      // Define usercode from localStorage or fallback
                      let usercode = "Adm488";
                      try {
                        const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}") || {};
                        usercode = userInfo.userCode || "Adm488";
                      } catch { }
                      for (const qid of selectedQuestions) {
                        const q = questions.find(q => q.id === qid);
                        if (!q) continue;
                        const input = {
                          questionid: Number(q.id),
                          questionrequestid: Number(q.questionrequestid),
                          usercode: usercode || "Adm488",
                        };
                        const result = await deleteQuestion(input);
                        if (
                          result === true ||
                          (
                            result &&
                            typeof result === "object" &&
                            "status" in result &&
                            Array.isArray((result as any).status) &&
                            (result as any).status?.[0]?.[0] === "S001"
                          )
                        ) {
                          successCount++;
                        }
                      }
                      setSelectedQuestions([]);
                      await fetchData(); // Refresh data from backend after bulk delete
                      alert(`✅ Deleted ${successCount} question(s)`);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete Selected
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleExportToWord}>
                    <FileText className="h-4 w-4 mr-1" />
                    Export to Word
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      const [{ utils }, { saveAs }] = await Promise.all([
                        import('xlsx'),
                        import('file-saver')
                      ]);
                      // Filter only selected questions, or all visible questions if none selected
                      let results = [];
                      if (selectedQuestions.length > 0) {
                        results = questions.filter(q => selectedQuestions.includes(q.id));
                      } else {
                        results = questions;
                      }
                      results = results.filter(Boolean);
                      if (!results.length) {
                        alert('No questions available to export.');
                        return;
                      }
                      // Get book title from localStorage, fallback to 'questions'
                      let bookTitle = localStorage.getItem('bookTitle') || 'questions';
                      bookTitle = bookTitle.replace(/[^a-zA-Z0-9\-_]/g, '_');
                      const excelData = results.map((q, idx) => {
                        // Get options from q.values or q.options
                        const options = Array.isArray(q.values) ? q.values : (Array.isArray(q.options) ? q.options : []);
                        // Get correct answer
                        const correctAnswer = q.CorrectAnswer || q.answer || (typeof q.correct === 'number' && options[q.correct]) || '';
                        // Build row
                        const row = {
                          'S.No': idx + 1,
                          'Question': q.question || '',
                          'Type': q.type || '',
                          'Topic': q.topic || '',
                          'Difficulty': q.difficulty || '',
                          'Created': q.created || '',
                        };
                        // Add options as Option A, Option B, etc.
                        options.forEach((opt, i) => {
                          row[`Option ${String.fromCharCode(65 + i)}`] = opt;
                        });
                        // Add correct answer column
                        row['Correct Answer'] = correctAnswer;
                        return row;
                      });
                      const ws = utils.json_to_sheet(excelData);
                      const wb = utils.book_new();
                      utils.book_append_sheet(wb, ws, 'Selected Questions');
                      const { write } = await import('xlsx');
                      const arrayBuffer = write(wb, { bookType: 'xlsx', type: 'array' });
                      saveAs(new Blob([arrayBuffer], { type: 'application/octet-stream' }), `${bookTitle}.xlsx`);
                    }}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Export to Excel
                  </Button>

                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      {/* Master checkbox for select all */}
                      {(() => {
                        const selectAllRef = React.useRef<HTMLInputElement>(null);
                        React.useEffect(() => {
                          if (selectAllRef.current) {
                            selectAllRef.current.indeterminate = selectedQuestions.length > 0 && selectedQuestions.length < questions.length;
                          }
                        }, [selectedQuestions, questions]);
                        return (
                          <input
                            ref={selectAllRef}
                            type="checkbox"
                            className="rounded border-gray-300"
                            checked={questions.length > 0 && selectedQuestions.length === questions.length}
                            onChange={(e) => {
                              // Only select all or clear all
                              if (e.target.checked) {
                                setSelectedQuestions(questions.map(q => q.id));
                              } else {
                                setSelectedQuestions([]);
                              }
                            }}
                            aria-label="Select all questions"
                          />
                        );
                      })()}
                    </TableHead>
                    <TableHead className="w-16">#</TableHead>
                    <TableHead className="w-48">Question ID</TableHead>
                    <TableHead>Question</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questions.map((question, index) => (
                    <TableRow key={question.id}>
                      <TableCell>
                        {/* Individual row checkbox */}
                        <input
                          type="checkbox"
                          checked={selectedQuestions.includes(question.id)}
                          onChange={() => handleSelectQuestion(question.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="font-mono text-xs">{question.id}</TableCell>
                      <TableCell className="max-w-md">
                        <p className="truncate">{question.question}</p>
                      </TableCell>
                      <TableCell>{question.type}</TableCell>
                      <TableCell>
                        <span style={{ color: "#7e2a0c", fontSize: '0.875rem' }}>
                          {question.topic}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getDifficultyColor(question.difficulty)}>
                          {question.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <span style={{ fontSize: '0.875rem' }}>{question.created}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => { setPreviewQuestion(question); setPreviewOpen(true); }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => { setEditQuestion(question); setEditOpen(true); }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(question.id, question.questionrequestid)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
      <QuestionPreviewModal open={previewOpen} onClose={() => setPreviewOpen(false)} question={previewQuestion} />
      <EditQuestionModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        question={editQuestion}
        onSave={async updated => {
          // Save to backend
          try {
            const payload = {
              ...updated,
              id: updated.id,
              questionrequestid: updated.questionrequestid,
              question: updated.question,
              type: updated.type,
              options: updated.options,
              correct: updated.correct,
              feedback: updated.feedback,
            };
            await updateQuestion(payload);
            setQuestions(prev => {
              const idx = prev.findIndex(q => q.id === updated.id);
              if (idx === -1) return prev;
              const newArr = [...prev];
              newArr[idx] = { ...prev[idx], ...updated };
              return newArr;
            });
            setEditOpen(false);
            alert("✅ Changes saved");
          } catch (e) {
            alert("❌ Failed to save changes");
          }
        }}
      />
    </div>
  );
};

export default QuestionRepository;

// QuestionPreviewModal component
function QuestionPreviewModal({ open, onClose, question }: { open: boolean; onClose: () => void; question: any }) {
  const [showAll, setShowAll] = React.useState(false);
  if (!question) return null;
  const allKeys = Object.keys(question);
  // For options, prefer question.values or question.options
  const options = Array.isArray(question.values) ? question.values : (Array.isArray(question.options) ? question.options : []);
  // Feedback per option (FeedbackOptionA, etc)
  const feedbacks = allKeys.filter(k => k.toLowerCase().startsWith('feedbackoption'));
  // General feedback
  const generalFeedback = question.feedback || question.Feedback || '';
  // Correct answer
  const correctAnswer = question.CorrectAnswer || question.answer || (typeof question.correct === 'number' && options[question.correct]) || '-';
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent style={{ maxHeight: "80vh", overflowY: "auto" }}>
        <DialogHeader>
          <DialogTitle>Question Preview</DialogTitle>
        </DialogHeader>
        <div className="py-2 space-y-2">
          <div><b>Question Identifier:</b> {question.id || question.identifier || '-'}</div>

          <div><b>Question Statement:</b> {question.QuestionStatement || question.question || '-'}</div>

          <div><b>Reference Info:</b> {question.ReferenceInfo || '-'}</div>
          <div><b>Marks:</b> {question.marks || question.MaxMarks || '-'}</div>
          <div><b>Correct Answer:</b> {correctAnswer}</div>
          <div><b>Options:</b>
            <ul className="pl-4 list-disc">
              {options.length > 0 ? options.map((opt, i) => (
                <li key={i}>{opt}</li>
              )) : <li>-</li>}
            </ul>
          </div>

          <div><b>Feedback (per option):</b>
            <ul className="pl-4 list-disc">
              {feedbacks.length > 0 ? feedbacks.map((k, i) => (
                <li key={i}><b>{k.replace('FeedbackOption', 'Option ')}:</b> {question[k]}</li>
              )) : <li>-</li>}
            </ul>
          </div>
          {/* Show all other fields for completeness */}
          <button className="text-xs underline text-blue-700" type="button" onClick={() => setShowAll(v => !v)}>
            {showAll ? "Hide all fields" : "Show all fields"}
          </button>
          {showAll && (
            <div className="text-xs mt-2 space-y-1 border-t pt-2">
              {allKeys.map(k => (
                <div key={k}><b>{k}:</b> {typeof question[k] === 'object' ? JSON.stringify(question[k]) : String(question[k])}</div>
              ))}
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// EditQuestionModal component (full fields, expandable)
const EditQuestionModal: React.FC<{
  open: boolean;
  onClose: () => void;
  question: any;
  onSave: (q: any) => void;
}> = ({ open, onClose, question, onSave }) => {
  const [edited, setEdited] = React.useState<any>(question || {});
  const [showAll, setShowAll] = React.useState(false);
  React.useEffect(() => { setEdited(question || {}); }, [question]);
  if (!question) return null;
  // Helper for array fields
  const handleArrayChange = (field, idx, value) => {
    const arr = Array.isArray(edited[field]) ? [...edited[field]] : [];
    arr[idx] = value;
    setEdited({ ...edited, [field]: arr });
  };
  // Helper for feedback fields
  const handleFeedbackChange = (key, value) => {
    setEdited({ ...edited, [key]: value });
  };
  // List all keys for editing
  const allKeys = Object.keys(edited);
  // Option fields
  const options = Array.isArray(edited.values) ? edited.values : (Array.isArray(edited.options) ? edited.options : []);
  // Feedback fields
  const feedbacks = allKeys.filter(k => k.toLowerCase().startsWith('feedbackoption'));
  // General feedback
  const generalFeedback = edited.feedback || edited.Feedback || '';
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent style={{ maxHeight: "80vh", overflowY: "auto" }}>
        <DialogHeader>
          <DialogTitle>Edit Question (All Fields)</DialogTitle>
        </DialogHeader>
        <div className="py-2 space-y-2">

          <div>
            <label className="block text-sm font-medium mb-1">Question Statement</label>
            <Input value={edited.QuestionStatement || edited.question || ''} onChange={e => setEdited({ ...edited, QuestionStatement: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Correct Answer</label>
            <Input value={edited.CorrectAnswer || edited.answer || ''} onChange={e => setEdited({ ...edited, CorrectAnswer: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Options</label>
            {options.length > 0 ? options.map((opt, i) => (
              <Input key={i} className="mb-1" value={opt} onChange={e => handleArrayChange(Array.isArray(edited.values) ? 'values' : 'options', i, e.target.value)} />
            )) : <Input className="mb-1" value="" readOnly />}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Feedback (General)</label>
            <Input value={generalFeedback} onChange={e => setEdited({ ...edited, feedback: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Feedback (per option)</label>
            {feedbacks.length > 0 ? feedbacks.map((k, i) => (
              <div key={k} className="flex gap-2 mb-1">
                <span className="w-32">{k.replace('FeedbackOption', 'Option ')}</span>
                <Input value={edited[k] || ''} onChange={e => handleFeedbackChange(k, e.target.value)} />
              </div>
            )) : <Input className="mb-1" value="" readOnly />}
          </div>

        </div>
        <DialogFooter>
          <Button onClick={() => onSave(edited)}>Save</Button>
          <DialogClose asChild>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
