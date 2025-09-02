import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import { getChapters as getChaptersByBookCode, Chapter, getLearningObjectives, LearningObjective, fetchDropdownOptions } from "../api";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { Switch } from "../components/ui/switch";
import { ArrowLeft, Sparkles, FileText, Zap, Settings2, Target, Globe, Hash, Brain, MessageSquare, Database, User, FileSpreadsheet, Trash2, Eye, Edit3, Clock, Save } from "lucide-react";

function transformUsageData(statsRaw: any[]): any[] {
  // Dummy implementation to avoid runtime error
  return statsRaw;
}

const QuestionGenerator = () => {
  // DropdownDashboard state for taxonomy, question type, and quantity
  const [taxonomyList, setTaxonomyList] = useState<string[]>([]);
  const [questionTypes, setQuestionTypes] = useState<string[]>([]);
  const [questionQuantities, setQuestionQuantities] = useState<number[]>([]);

  // Always default to "-- Select --" (empty value) for Taxonomy Framework
  // Always default to "-- Select --" (empty value) for Taxonomy Framework on navigation
  const [selectedTaxonomy, setSelectedTaxonomy] = useState(() => "");
  const [selectedQuestionType, setSelectedQuestionType] = useState(() => {
    // Always default to "Multiple Choice" on navigation
    return "Multiple Choice";
  });
  // Always default to "-- Select --" (empty value) for Question Quantity on navigation
  const [selectedQuantity, setSelectedQuantity] = useState<string | number>(() => "");

  const [dropdownError, setDropdownError] = useState<string>("");
  useEffect(() => {
    const fetchDropdowns = async () => {
      // Try to get session info from localStorage, fallback to userInfo if needed
      let custcode = localStorage.getItem("custcode");
      let orgcode = localStorage.getItem("orgcode");
      let appcode = localStorage.getItem("appcode");
      // If any are missing, try to get from userInfo (like ItemGeneration)
      if (!custcode || !orgcode) {
        const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}") || {};
        if (!custcode) custcode = userInfo.customerCode || "ES";
        if (!orgcode) orgcode = userInfo.orgCode || "Exc195";
        if (!appcode) appcode = "IG";
        // Set them in localStorage for API compatibility
        if (custcode) localStorage.setItem("custcode", custcode);
        if (orgcode) localStorage.setItem("orgcode", orgcode);
        if (appcode) localStorage.setItem("appcode", appcode);
      }
      if (!custcode || !orgcode || !appcode) {
        setDropdownError("Please login again. Required session information is missing.");
        setTaxonomyList([]);
        setQuestionTypes([]);
        setQuestionQuantities([]);
        return;
      }
      try {
        const data = await fetchDropdownOptions();
        let found = false;
        data.forEach((item: any) => {
          const parsed = JSON.parse(item.jsonDetails);
          if (item.type === "taxonomy") {
            setTaxonomyList(parsed.map((t: any) => t.taxonomy));
            found = true;
          }
          if (item.type === "QuestionType") {
            setQuestionTypes(parsed.map((q: any) => q.questiontype));
            found = true;
          }
          if (item.type === "numberof_questions") {
            setQuestionQuantities(parsed.map((n: any) => n.numberof_questions));
            found = true;
          }
        });
        if (!found) {
          setDropdownError("No dropdown data found. Please contact support.");
        } else {
          setDropdownError("");
        }
      } catch (error) {
        setDropdownError("Failed to load dropdowns. Please check your connection or login again.");
        setTaxonomyList([]);
        setQuestionTypes([]);
        setQuestionQuantities([]);
      }
    };
    fetchDropdowns();
  }, []);

  // --- Book Title State and Effect ---
  const { bookCode } = useParams();
  const location = useLocation();
  const [bookTitle, setBookTitle] = useState("");

  function getBookTitle() {
    // 1. Prefer navigation state (from ItemGeneration.tsx)
    if (location && location.state && (location.state.bookTitle || location.state.title || location.state.name)) {
      // Try all possible keys for book name
      return location.state.bookTitle || location.state.title || location.state.name;
    }
    // 2. Fallback to localStorage logic
    let code = "1";
    if (typeof bookCode === 'string' && bookCode) {
      code = bookCode;
    } else {
      const stored = localStorage.getItem('bookCode');
      if (stored) code = stored;
    }
    let bookTitle = "";
    try {
      const cardRaw = localStorage.getItem(`bookCard_${code}`);
      if (cardRaw) {
        const card = JSON.parse(cardRaw);
        // Try to get the book title from the card object, including nested book.title
        bookTitle = card.title || card.bookTitle || card.name || (card.book && card.book.title) || "";
      }
    } catch { }
    if (!bookTitle) {
      bookTitle = localStorage.getItem('bookTitle') || "Untitled Book";
    }
    return bookTitle;
  }

  useEffect(() => {
    // Always update book title on mount and when navigation state or bookCode changes
    setBookTitle(getBookTitle());
    // Listen for storage changes (e.g., if bookCard or bookTitle changes in another tab)
    const updateBookTitle = () => setBookTitle(getBookTitle());
    window.addEventListener('storage', updateBookTitle);
    return () => window.removeEventListener('storage', updateBookTitle);
  }, [bookCode, location && location.state]);

  let tokenStats = [];
  try {
    const statsRaw = JSON.parse(localStorage.getItem("usageStats") || "null");
    if (Array.isArray(statsRaw)) {
      tokenStats = transformUsageData(statsRaw);
    }
  } catch { }
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("generate");
  const [generationMode, setGenerationMode] = useState(true); // true for LLM, false for Knowledge Base

  // Use state and effect for reactive remaining tokens
  const [remainingTokens, setRemainingTokens] = useState(0);

  // Chapter dropdown state (Study Domain)
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapter, setSelectedChapter] = useState(() => localStorage.getItem("selectedChapter") || "");
  const [chaptersLoading, setChaptersLoading] = useState(false);
  const [chaptersError, setChaptersError] = useState<string>("");

  // Learning Objectives (LO) dropdown state
  const [learningObjectives, setLearningObjectives] = useState<LearningObjective[]>([]);
  const [selectedLO, setSelectedLO] = useState(() => localStorage.getItem("selectedLO") || "");
  const [loLoading, setLoLoading] = useState(false);
  const [loError, setLoError] = useState<string>("");

  // Point Value
  const [pointValue, setPointValue] = useState(() => localStorage.getItem("pointValue") || "1");

  // Additional Instructions
  const [additionalInstructions, setAdditionalInstructions] = useState(() => {
    // Only restore if coming from navigation, not on page refresh
    const navState = window.performance && window.performance.getEntriesByType && window.performance.getEntriesByType('navigation');
    // Defensive: check for type property on PerformanceNavigationTiming
    let isReload = false;
    if (navState && navState.length > 0) {
      const nav = navState[0] as any;
      if (nav && nav.type && nav.type === 'reload') {
        isReload = true;
      }
    }
    if (isReload) {
      // On reload, clear the value
      localStorage.removeItem('additionalInstructions');
      return '';
    }
    return localStorage.getItem("additionalInstructions") || "";
  });

  useEffect(() => {
    function updateTokens() {
      try {
        const stats = JSON.parse(localStorage.getItem("usageStats") || "null");
        let value = 0;
        if (Array.isArray(stats)) {
          if (typeof stats[2] === "number") {
            value = stats[2];
          } else if (typeof stats[2] === "string") {
            value = Number(stats[2].replace(/,/g, ""));
          }
        }
        setRemainingTokens(isNaN(value) ? 0 : value);
      } catch {
        setRemainingTokens(0);
      }
    }
    updateTokens();
    window.addEventListener("storage", updateTokens);
    return () => window.removeEventListener("storage", updateTokens);
  }, []);

  // Fetch chapters for dropdown
  useEffect(() => {
    const loadChapters = async () => {
      setChaptersLoading(true);
      setChaptersError("");
      try {
        // Always use bookCode "2" for chapter API
        const result = await getChaptersByBookCode(localStorage.getItem("bookType") || "");
        if (Array.isArray(result) && result.length > 0) {
          setChapters(result);
          // Restore from localStorage or default to first
          setSelectedChapter((prev) => {
            const stored = localStorage.getItem("selectedChapter");
            if (stored && result.some(ch => ch.chapterCode === stored)) return stored;
            return result[0].chapterCode || "";
          });
        } else {
          setChapters([]);
          setSelectedChapter("");
        }
      } catch (err) {
        setChaptersError("Failed to load chapters");
        setChapters([]);
        setSelectedChapter("");
      } finally {
        setChaptersLoading(false);
      }
    };
    loadChapters();
  }, [bookCode]);

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
    // Defensive: trim chapter code for API
    const chapterCode = selectedChapter.trim();
    getLearningObjectives(chapterCode)
      .then((result) => {
        setLearningObjectives(result);
        // Restore from localStorage or default to first
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

  const handleGenerateQuestions = () => {
    // Gather all required data for item generation
    const params = {
      question: additionalInstructions,
      selectedOption: generationMode ? "Book Based" : "Global",
      selectedBook: { bookid: localStorage.getItem("bookCode") || "2" },
      questiontypeid: selectedQuestionType,
      taxonomyid: selectedTaxonomy,
      difficultylevelid: "1", // You may want to add a difficulty dropdown
      selectedChapterCode: selectedChapter,
      looutcomesId: selectedLO,
      selectedQuantity: selectedQuantity, // Pass as selectedQuantity for downstream
      noofquestions: selectedQuantity, // Always pass as noofquestions for downstream
      creativitylevelid: "1", // You may want to add a creativity dropdown
      agenttype: "1", // You may want to add an agent type selector
    };
    navigate("/question-generation-loading", { state: params });
  };

  // Persist Study Domain (Chapter)
  useEffect(() => {
    if (selectedChapter) localStorage.setItem("selectedChapter", selectedChapter);
  }, [selectedChapter]);

  // Persist Learning Objective
  useEffect(() => {
    if (selectedLO) localStorage.setItem("selectedLO", selectedLO);
  }, [selectedLO]);

  // Persist Point Value
  useEffect(() => {
    if (pointValue) localStorage.setItem("pointValue", pointValue);
  }, [pointValue]);

  // Persist Additional Instructions
  useEffect(() => {
    localStorage.setItem("additionalInstructions", additionalInstructions);
  }, [additionalInstructions]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AL</span>
              </div>
              <img
                src="/lovable-uploads/b5b0f5a8-9552-4635-8c44-d5e6f994179c.png"
                alt="AI-Levate"
                className="h-5 w-auto"
              />
              <span className="text-sm text-gray-500">
                {bookTitle}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-600 rounded flex items-center justify-center">
                <span className="text-white text-xs">✦</span>
              </div>
              <span className="text-sm text-purple-600 font-medium">{bookTitle}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-xs">⚡</span>
              </div>
              <span className="text-sm text-blue-600 font-medium">
                {/* Show total tokens used from localStorage data[0] if available, else 0 */}
                {(() => {
                  let total = "0";
                  try {
                    const statsRaw = JSON.parse(localStorage.getItem("usageStats") || "null");
                    if (Array.isArray(statsRaw) && statsRaw.length > 0 && statsRaw[0] != null) {
                      total = Number(statsRaw[0]).toLocaleString();
                    }
                  } catch { }
                  return total + " Tokens";
                })()}
              </span>
            </div>
            <Link to="/item-generation">
              <Button variant="ghost" size="sm" className="text-gray-600">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Knowledge Base
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600"
              onClick={() => {
                localStorage.removeItem('authToken')
                localStorage.removeItem('userSession')
                sessionStorage.clear()
                window.location.href = "/"
              }}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-2 max-w-lg">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setActiveTab("generate")}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${activeTab === "generate"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
              >
                <Sparkles className="h-4 w-4" />
                Generate Questions
              </button>
              <button
                onClick={() => {
                  setActiveTab("repository");
                  navigate("/question-repository");
                }}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${window.location.pathname === "/question-repository" || activeTab === "repository"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
              >
                <FileText className="h-4 w-4" />
                Question Repository
              </button>
            </div>
          </div>
        </div>

        {activeTab === "generate" && (
          <div className="space-y-6">
            {/* Top Row - Tokens and AI Mode */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Available Tokens */}
              <Card className="p-6 bg-white border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-700">Available Tokens</h3>
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {remainingTokens.toLocaleString()}

                </div>
                <div className="text-sm text-green-600 flex items-center gap-1">
                  <span>
                    {/* Show today's token usage from localStorage usageStats[1] if available, else 0 */}
                    {(() => {
                      let today = 0;
                      try {
                        const statsRaw = JSON.parse(localStorage.getItem("usageStats") || "null");
                        if (Array.isArray(statsRaw) && statsRaw.length > 1 && statsRaw[1] != null) {
                          if (typeof statsRaw[1] === "number") {
                            today = statsRaw[1];
                          } else if (typeof statsRaw[1] === "string") {
                            const cleaned = statsRaw[1].replace(/[^\d.]/g, "");
                            today = Number(cleaned);
                          }
                        }
                      } catch { }
                      return `+${today.toLocaleString()} today`;
                    })()}
                  </span>
                </div>
              </Card>

              {/* AI Generation Mode */}
              <Card className="p-6 bg-white border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-700">AI Generation Mode</h3>
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Settings2 className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Knowledge Base</span>
                  <Switch
                    checked={generationMode}
                    onCheckedChange={setGenerationMode}
                    className="data-[state=checked]:bg-blue-600"
                  />
                  <span className="text-sm font-medium text-blue-600">LLM</span>
                </div>
              </Card>
            </div>

            {/* Main Content Row */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Column - Source Material */}
              <div className="lg:col-span-1 space-y-6">
                {/* Source Material */}
                <Card className="p-6 bg-white border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Source Material</h3>
                  <p className="text-xs text-gray-500 mb-4">AI enhanced content</p>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                    <img
                      src="/lovable-uploads/a13547e7-af5f-49b0-bb15-9b344d6cd72e.png"
                      alt="Cyber Risk Management"
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <h4 className="font-medium text-gray-900 text-sm mb-1">
                      {bookTitle}
                    </h4>
                    <p className="text-xs text-gray-500">Source material loaded successfully</p>
                  </div>
                </Card>
              </div>

              {/* Right Column - AI Question Generator */}
              <div className="lg:col-span-3">
                <Card className="p-6 bg-white border border-gray-200">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">AI Question Generator</h3>
                      <p className="text-sm text-gray-500">Configure your question generation settings</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left side form */}
                    <div className="space-y-6">
                      {/* Study Domain */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Target className="w-4 h-4 text-blue-600" />
                          <label className="text-sm font-medium text-gray-700">Study Domain (Chapter)</label>
                        </div>
                        <Select
                          value={selectedChapter}
                          onValueChange={val => setSelectedChapter(val)}
                          disabled={chaptersLoading || chapters.length === 0}
                        >
                          <SelectTrigger className="w-full bg-white border-gray-200">
                            <SelectValue placeholder={chaptersLoading ? "Loading..." : chaptersError ? chaptersError : "Select chapter"} />
                          </SelectTrigger>
                          <SelectContent>

                            {chaptersLoading && (
                              <div className="px-4 py-2 text-sm text-gray-500">Loading chapters...</div>
                            )}
                            {chaptersError && !chaptersLoading && (
                              <div className="px-4 py-2 text-sm text-red-500">{chaptersError}</div>
                            )}
                            {!chaptersLoading && !chaptersError && chapters.length > 0 && chapters.map((chapter) => (
                              <SelectItem key={chapter.chapterCode} value={chapter.chapterCode}>
                                {chapter.chapterName || chapter.chapterCode}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Taxonomy Framework (Taxonomy) */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Globe className="w-4 h-4 text-blue-600" />
                          <label className="text-sm font-medium text-gray-700">Taxonomy Framework</label>
                        </div>
                        {dropdownError ? (
                          <div className="text-red-500 text-xs mb-2">{dropdownError}</div>
                        ) : null}
                        <select
                          className="w-full border rounded px-3 py-2"
                          value={selectedTaxonomy}
                          onChange={e => {
                            setSelectedTaxonomy(e.target.value);
                            localStorage.setItem("selectedTaxonomy", e.target.value);
                          }}
                          disabled={!!dropdownError || taxonomyList.length === 0}
                        >
                          <option value="">-- Select --</option>
                          {taxonomyList.map((tax, idx) => (
                            <option key={idx} value={tax}>{tax}</option>
                          ))}
                        </select>
                      </div>

                      {/* Question Quantity */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="w-4 h-4 text-pink-600 text-sm font-bold">
                            <Hash className="w-4 h-4 text-orange-600" />
                          </span>
                          <label className="text-sm font-medium text-gray-700">Question Quantity</label>
                        </div>
                        {dropdownError ? (
                          <div className="text-red-500 text-xs mb-2">{dropdownError}</div>
                        ) : null}
                        <select
                          className="w-full border rounded px-3 py-2"
                          value={selectedQuantity}
                          onChange={e => {
                            setSelectedQuantity(e.target.value);
                            localStorage.setItem("selectedQuantity", e.target.value);
                          }}
                          disabled={!!dropdownError || questionQuantities.length === 0}
                        >

                          {questionQuantities.map((qty, idx) => (
                            <option key={idx} value={qty}>{qty}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Right side form */}
                    <div className="space-y-6">
                      {/* Learning Objectives*/}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Brain className="w-4 h-4 text-blue-600" />
                          <label className="text-sm font-medium text-gray-700">Learning Objectives</label>
                        </div>
                        <Select
                          value={selectedLO}
                          onValueChange={val => setSelectedLO(val)}
                          disabled={loLoading || learningObjectives.length === 0}
                        >
                          <SelectTrigger className="w-full bg-white border-gray-200">
                            <SelectValue placeholder={loLoading ? "Loading..." : loError ? loError : "Select learning objective"} />
                          </SelectTrigger>
                          <SelectContent>
                            {loLoading && (
                              <div className="px-4 py-2 text-sm text-gray-500">Loading learning objectives...</div>
                            )}
                            {loError && !loLoading && (
                              <div className="px-4 py-2 text-sm text-red-500">{loError}</div>
                            )}
                            {!loLoading && !loError && learningObjectives.length > 0 && learningObjectives.map((lo) => (
                              <SelectItem key={lo.loCode} value={lo.loCode}>
                                {lo.loName || lo.loCode}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>


                      {/* Question Format (Question Type) */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <FileText className="w-4 h-4 text-green-600" />
                          <label className="text-sm font-medium text-gray-700">Question Format</label>
                        </div>
                        {dropdownError ? (
                          <div className="text-red-500 text-xs mb-2">{dropdownError}</div>
                        ) : null}
                        <select
                          className="w-full border rounded px-3 py-2"
                          value={selectedQuestionType}
                          onChange={e => {
                            setSelectedQuestionType(e.target.value);
                            localStorage.setItem("selectedQuestionType", e.target.value);
                          }}
                          disabled={!!dropdownError || questionTypes.length === 0}
                        >
                          {questionTypes.map((type, idx) => (
                            <option key={idx} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>

                      {/* Point Value */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="w-4 h-4 text-pink-600 text-sm font-bold">★</span>
                          <label className="text-sm font-medium text-gray-700">Point Value</label>
                        </div>
                        <select
                          className="w-full border rounded px-3 py-2"
                          value={pointValue}
                          onChange={e => setPointValue(e.target.value)}
                        >

                          {selectedQuestionType === "Multiple Choice" && (
                            <>
                              <option value="5">1</option>

                            </>
                          )}
                          {selectedQuestionType === "Written Response" && (
                            <>
                              <option value="5">5</option>
                              <option value="10">10</option>
                            </>
                          )}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Additional Instructions - Full Width */}
                  <div className="mt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageSquare className="w-4 h-4 text-purple-600" />
                      <label className="text-sm font-medium text-gray-700">Additional Instructions</label>
                    </div>
                    <Textarea
                      placeholder="Provide specific instructions for AI question generation..."
                      className="min-h-[100px] bg-white border-gray-200"
                      value={additionalInstructions}
                      onChange={e => setAdditionalInstructions(e.target.value)}
                    />
                  </div>

                  {/* Generate Button */}
                  <div className="flex justify-center mt-8">
                    <Button
                      onClick={handleGenerateQuestions}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Questions
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}


        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white text-xs">⚡</span>
            </div>
            <span>Powered by advanced AI technology</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuestionGenerator
