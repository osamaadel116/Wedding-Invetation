import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileSpreadsheet,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Plus,
  Users,
  CalendarCheck,
  UserX,
  AlertCircle,
  Trash2,
  LogOut,
  FolderOpen,
  Sparkles,
  Info,
  X,
  Check,
} from 'lucide-react';
import { User } from 'firebase/auth';
import {
  initAuth,
  googleSignIn,
  logout,
  getAccessToken,
  getCurrentUser,
} from '../services/googleAuth';
import {
  listUserSpreadsheets,
  getSpreadsheetMetadata,
  createWeddingSpreadsheet,
  readRsvpStats,
  clearSheetDataRows,
  DriveSpreadsheetItem,
  SheetRsvpStats,
} from '../services/googleSheets';
import { GoogleSignInButton } from './GoogleSignInButton';

interface GoogleSheetsManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSheetConfigured?: (spreadsheetId: string, sheetTitle: string) => void;
}

export const GoogleSheetsManager: React.FC<GoogleSheetsManagerProps> = ({
  isOpen,
  onClose,
  onSheetConfigured,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(getCurrentUser());
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Spreadsheet selection & state
  const [driveSheets, setDriveSheets] = useState<DriveSpreadsheetItem[]>([]);
  const [isLoadingSheets, setIsLoadingSheets] = useState(false);
  const [selectedSpreadsheetId, setSelectedSpreadsheetId] = useState<string>(() => {
    return localStorage.getItem('wedding_google_sheet_id') || '';
  });
  const [selectedSheetName, setSelectedSheetName] = useState<string>(() => {
    return localStorage.getItem('wedding_google_sheet_tab') || 'RSVPs';
  });
  const [availableTabs, setAvailableTabs] = useState<string[]>(['RSVPs', 'Wishes']);
  const [sheetStats, setSheetStats] = useState<SheetRsvpStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isCreatingSheet, setIsCreatingSheet] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Destructive Action Confirmation Modal state (Mandatory per Workspace Skill guidelines)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    actionType: 'create' | 'clear';
    onConfirm: () => Promise<void>;
  }>({
    isOpen: false,
    title: '',
    description: '',
    actionType: 'create',
    onConfirm: async () => {},
  });

  // Listen to auth state
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setCurrentUser(user);
        setAccessToken(token);
        setAuthError(null);
      },
      () => {
        setCurrentUser(null);
        setAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // When access token is ready, load spreadsheets list and load stats if sheet is selected
  useEffect(() => {
    if (accessToken) {
      loadDriveSpreadsheets(accessToken);
      if (selectedSpreadsheetId) {
        refreshSheetDetailsAndStats(accessToken, selectedSpreadsheetId);
      }
    }
  }, [accessToken, selectedSpreadsheetId]);

  const loadDriveSpreadsheets = async (token: string) => {
    setIsLoadingSheets(true);
    try {
      const files = await listUserSpreadsheets(token);
      setDriveSheets(files);
    } catch (err: any) {
      console.error('Failed to list spreadsheets:', err);
    } finally {
      setIsLoadingSheets(false);
    }
  };

  const refreshSheetDetailsAndStats = async (token: string, sheetId: string) => {
    setIsLoadingStats(true);
    try {
      const meta = await getSpreadsheetMetadata(token, sheetId);
      const tabNames = meta.sheets.map((s) => s.title);
      setAvailableTabs(tabNames);

      const targetTab = tabNames.includes(selectedSheetName)
        ? selectedSheetName
        : tabNames[0] || 'RSVPs';

      setSelectedSheetName(targetTab);

      const stats = await readRsvpStats(token, sheetId, targetTab);
      setSheetStats(stats);
      if (onSheetConfigured) {
        onSheetConfigured(sheetId, targetTab);
      }
    } catch (err: any) {
      console.error('Failed to load sheet details:', err);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleSignIn = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setCurrentUser(result.user);
        setAccessToken(result.accessToken);
        setSuccessMessage('Successfully connected to Google Workspace!');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err: any) {
      if (
        err?.code === 'auth/popup-closed-by-user' ||
        err?.code === 'auth/cancelled-popup-request' ||
        err?.message?.includes('popup-closed-by-user')
      ) {
        // User closed or dismissed the popup window, no error needed
        return;
      }

      if (err?.code === 'auth/popup-blocked') {
        setAuthError('The sign-in popup was blocked by your browser. Please allow popups for this page to sign in.');
        return;
      }

      console.error('Google Sign-In failed:', err);
      setAuthError(err.message || 'Failed to authenticate with Google. Please try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    setCurrentUser(null);
    setAccessToken(null);
    setSheetStats(null);
    setSuccessMessage('Signed out successfully.');
    setTimeout(() => setSuccessMessage(null), 2500);
  };

  const requestCreateNewSpreadsheet = () => {
    if (!accessToken) return;

    // Show Mandatory Confirmation Dialog
    setConfirmDialog({
      isOpen: true,
      title: 'Create New Wedding Google Sheet?',
      description:
        'This will create a new Google Spreadsheet titled "Wedding RSVPs & Wishes" in your Google Drive with pre-configured "RSVPs" and "Wishes" tabs.',
      actionType: 'create',
      onConfirm: async () => {
        setIsCreatingSheet(true);
        try {
          const newSheet = await createWeddingSpreadsheet(
            accessToken,
            'Wedding RSVPs & Wishes'
          );
          setSelectedSpreadsheetId(newSheet.id);
          setSelectedSheetName('RSVPs');
          localStorage.setItem('wedding_google_sheet_id', newSheet.id);
          localStorage.setItem('wedding_google_sheet_tab', 'RSVPs');

          await loadDriveSpreadsheets(accessToken);
          await refreshSheetDetailsAndStats(accessToken, newSheet.id);

          setSuccessMessage(`Created spreadsheet "${newSheet.title}" in your Google Drive!`);
          setTimeout(() => setSuccessMessage(null), 3500);
        } catch (err: any) {
          alert('Failed to create Google Sheet: ' + err.message);
        } finally {
          setIsCreatingSheet(false);
        }
      },
    });
  };

  const handleSelectSpreadsheet = async (sheetId: string) => {
    setSelectedSpreadsheetId(sheetId);
    localStorage.setItem('wedding_google_sheet_id', sheetId);
    if (accessToken && sheetId) {
      await refreshSheetDetailsAndStats(accessToken, sheetId);
    }
  };

  const handleTabChange = async (tabName: string) => {
    setSelectedSheetName(tabName);
    localStorage.setItem('wedding_google_sheet_tab', tabName);
    if (accessToken && selectedSpreadsheetId) {
      setIsLoadingStats(true);
      try {
        const stats = await readRsvpStats(accessToken, selectedSpreadsheetId, tabName);
        setSheetStats(stats);
        if (onSheetConfigured) {
          onSheetConfigured(selectedSpreadsheetId, tabName);
        }
      } catch (err) {
        console.error('Error changing tab:', err);
      } finally {
        setIsLoadingStats(false);
      }
    }
  };

  const requestClearSheet = () => {
    if (!accessToken || !selectedSpreadsheetId) return;

    // Mandatory Destructive Confirmation Dialog
    setConfirmDialog({
      isOpen: true,
      title: 'Clear Sheet RSVP Records?',
      description: `Are you sure you want to clear the RSVP rows from the "${selectedSheetName}" tab in your Google Spreadsheet? The header columns will be preserved, but all recorded guest entries will be removed.`,
      actionType: 'clear',
      onConfirm: async () => {
        try {
          await clearSheetDataRows(accessToken, selectedSpreadsheetId, selectedSheetName);
          await refreshSheetDetailsAndStats(accessToken, selectedSpreadsheetId);
          setSuccessMessage('Sheet responses cleared successfully.');
          setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
          alert('Failed to clear sheet data: ' + err.message);
        }
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-[#FAF7F2] border border-[#DFC186]/50 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative"
      >
        {/* Header Bar */}
        <div className="px-6 py-5 bg-[#2E2420] text-[#F3E5AB] flex items-center justify-between border-b border-[#DFC186]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif-display text-xl sm:text-2xl font-bold tracking-wide text-white">
                Google Sheets RSVP Integration
              </h2>
              <p className="text-xs text-[#DFC186]/80 font-sans-body">
                Sync guest RSVPs & wishes in real-time directly to your Google Drive
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#F3E5AB] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Notifications */}
          <AnimatePresence>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 flex items-center gap-2.5 text-emerald-800 text-xs sm:text-sm"
              >
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </motion.div>
            )}

            {authError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-rose-50 border border-rose-300 rounded-xl p-3 flex items-center gap-2.5 text-rose-800 text-xs sm:text-sm"
              >
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{authError}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Section 1: Authentication State */}
          <div className="bg-white rounded-2xl p-5 border border-[#E8DFD8] shadow-sm">
            <h3 className="text-sm font-semibold text-[#2E2420] uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#8C6D3B]" />
              1. Google Account Connection
            </h3>

            {!currentUser || !accessToken ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2">
                <div className="space-y-1 max-w-md">
                  <p className="text-sm text-[#5C4A3E]">
                    Connect your Google account with permission to automatically read & write RSVPs to your personal Google Sheets.
                  </p>
                  <p className="text-xs text-[#8C7A6B]">
                    Uses Google OAuth to safely connect to your Google Drive and Google Sheets.
                  </p>
                </div>
                <div className="shrink-0">
                  <GoogleSignInButton
                    onClick={handleSignIn}
                    disabled={isAuthenticating}
                    text={isAuthenticating ? 'Connecting...' : 'Sign in with Google'}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'Google User'}
                      className="w-11 h-11 rounded-full border-2 border-emerald-500 shadow-sm"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-emerald-100 border border-emerald-400 flex items-center justify-center font-bold text-emerald-800">
                      {currentUser.displayName ? currentUser.displayName[0] : 'G'}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-[#2E2420]">
                        {currentUser.displayName || 'Connected User'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Connected
                      </span>
                    </div>
                    <p className="text-xs text-[#7A6B5F]">{currentUser.email}</p>
                  </div>
                </div>

                <button
                  onClick={handleSignOut}
                  className="px-3.5 py-1.5 rounded-xl border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Disconnect</span>
                </button>
              </div>
            )}
          </div>

          {/* Section 2: Choose or Create Google Sheet (when authenticated) */}
          {currentUser && accessToken && (
            <div className="bg-white rounded-2xl p-5 border border-[#E8DFD8] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#2E2420] uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#8C6D3B]" />
                  2. Select or Create Wedding Spreadsheet
                </h3>

                <button
                  onClick={requestCreateNewSpreadsheet}
                  disabled={isCreatingSheet}
                  className="px-3.5 py-1.5 rounded-xl bg-[#2E2420] hover:bg-[#43352F] text-[#F3E5AB] text-xs font-medium flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#DFC186]" />
                  <span>{isCreatingSheet ? 'Creating Sheet...' : 'Create New Wedding Sheet'}</span>
                </button>
              </div>

              {/* Spreadsheets selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#736357] mb-1.5">
                    Google Spreadsheet from your Drive:
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={selectedSpreadsheetId}
                      onChange={(e) => handleSelectSpreadsheet(e.target.value)}
                      className="w-full text-xs sm:text-sm bg-[#FCFAF6] border border-[#D9C8B4] rounded-xl px-3 py-2 text-[#2E2420] focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/40"
                    >
                      <option value="">-- Choose a Spreadsheet --</option>
                      {driveSheets.map((sheet) => (
                        <option key={sheet.id} value={sheet.id}>
                          {sheet.name}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => loadDriveSpreadsheets(accessToken)}
                      disabled={isLoadingSheets}
                      title="Refresh files list"
                      className="p-2 border border-[#D9C8B4] rounded-xl hover:bg-stone-50 text-[#736357] transition-colors"
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoadingSheets ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#736357] mb-1.5">
                    Target Sheet / Tab:
                  </label>
                  <select
                    value={selectedSheetName}
                    onChange={(e) => handleTabChange(e.target.value)}
                    disabled={!selectedSpreadsheetId || availableTabs.length === 0}
                    className="w-full text-xs sm:text-sm bg-[#FCFAF6] border border-[#D9C8B4] rounded-xl px-3 py-2 text-[#2E2420] focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/40 disabled:opacity-50"
                  >
                    {availableTabs.map((tab) => (
                      <option key={tab} value={tab}>
                        Tab: {tab}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Active sheet link and action bar */}
              {selectedSpreadsheetId && (
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-stone-100">
                  <a
                    href={`https://docs.google.com/spreadsheets/d/${selectedSpreadsheetId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1.5 underline underline-offset-2"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>Open in Google Sheets</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => refreshSheetDetailsAndStats(accessToken, selectedSpreadsheetId)}
                      disabled={isLoadingStats}
                      className="px-3 py-1 rounded-lg border border-[#D9C8B4] hover:bg-stone-50 text-[#736357] flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className={`w-3 h-3 ${isLoadingStats ? 'animate-spin' : ''}`} />
                      <span>Sync Data</span>
                    </button>

                    <button
                      onClick={requestClearSheet}
                      className="px-3 py-1 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear Entries</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Section 3: Live RSVP Dashboard Stats (when sheet is linked) */}
          {selectedSpreadsheetId && sheetStats && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[#2E2420] uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#8C6D3B]" />
                3. Live Attendance & Response Summary
              </h3>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-4 rounded-2xl border border-[#E8DFD8] text-center shadow-xs">
                  <span className="text-[11px] font-medium text-[#8C7A6B] uppercase tracking-wider block">
                    Total Responses
                  </span>
                  <div className="text-2xl font-bold font-serif-display text-[#2E2420] mt-1">
                    {sheetStats.totalResponses}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-emerald-200 text-center shadow-xs">
                  <span className="text-[11px] font-medium text-emerald-700 uppercase tracking-wider block">
                    Attending RSVPs
                  </span>
                  <div className="text-2xl font-bold font-serif-display text-emerald-700 mt-1 flex items-center justify-center gap-1">
                    <CalendarCheck className="w-5 h-5 text-emerald-600" />
                    <span>{sheetStats.totalAttendingResponses}</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-blue-200 text-center shadow-xs">
                  <span className="text-[11px] font-medium text-blue-700 uppercase tracking-wider block">
                    Total Guests Coming
                  </span>
                  <div className="text-2xl font-bold font-serif-display text-blue-800 mt-1 flex items-center justify-center gap-1">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span>{sheetStats.totalGuestsAttending}</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-stone-200 text-center shadow-xs">
                  <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block">
                    Declined
                  </span>
                  <div className="text-2xl font-bold font-serif-display text-stone-600 mt-1 flex items-center justify-center gap-1">
                    <UserX className="w-5 h-5 text-stone-400" />
                    <span>{sheetStats.totalDeclined}</span>
                  </div>
                </div>
              </div>

              {/* Recent Responses Table */}
              <div className="bg-white rounded-2xl border border-[#E8DFD8] overflow-hidden shadow-xs">
                <div className="px-4 py-3 bg-[#FAF7F2] border-b border-[#E8DFD8] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#4A3B32] uppercase tracking-wider">
                    Recent Guest Submissions ({sheetStats.records.length})
                  </span>
                  <span className="text-[11px] text-[#8C7A6B]">
                    Tab: <span className="font-semibold text-[#2E2420]">{selectedSheetName}</span>
                  </span>
                </div>

                {sheetStats.records.length === 0 ? (
                  <div className="p-8 text-center text-[#8C7A6B] text-xs">
                    No RSVP submissions recorded in this sheet yet. As guests submit responses on the invitation, they will appear here and in your Google Spreadsheet!
                  </div>
                ) : (
                  <div className="overflow-x-auto max-h-60">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-50 text-stone-600 border-b border-stone-200 sticky top-0">
                        <tr>
                          <th className="py-2.5 px-3 font-medium">Timestamp</th>
                          <th className="py-2.5 px-3 font-medium">Guest Name</th>
                          <th className="py-2.5 px-3 font-medium">Status</th>
                          <th className="py-2.5 px-3 font-medium text-center">Guests</th>
                          <th className="py-2.5 px-3 font-medium">Dietary</th>
                          <th className="py-2.5 px-3 font-medium">Message</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {sheetStats.records.map((r, i) => (
                          <tr key={i} className="hover:bg-amber-50/40 transition-colors">
                            <td className="py-2 px-3 text-stone-500 whitespace-nowrap">{r.timestamp}</td>
                            <td className="py-2 px-3 font-medium text-[#2E2420]">{r.guestName}</td>
                            <td className="py-2 px-3">
                              {r.attendance === 'attending' ? (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-medium inline-block">
                                  Attending
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[10px] font-medium inline-block">
                                  Declined
                                </span>
                              )}
                            </td>
                            <td className="py-2 px-3 text-center font-medium text-[#2E2420]">
                              {r.attendance === 'attending' ? r.numberOfGuests : '-'}
                            </td>
                            <td className="py-2 px-3 text-stone-600 truncate max-w-[120px]">
                              {r.dietaryNotes || '-'}
                            </td>
                            <td className="py-2 px-3 text-stone-600 truncate max-w-[180px]">
                              {r.message || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tips Info Box */}
          <div className="bg-[#FAF7F2] border border-[#DFC186]/50 rounded-2xl p-4 flex items-start gap-3 text-xs text-[#6B5A4E]">
            <Info className="w-5 h-5 text-[#8C6D3B] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-[#2E2420]">How Google Sheets RSVP Sync Works:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>When guests fill out the RSVP form on your wedding invitation, their attendance details and personal messages are automatically written to your connected Google Spreadsheet.</li>
                <li>You can share view or edit access with wedding planners, caterers, and family members directly via Google Drive.</li>
                <li>All changes and rows sync live without requiring any database hosting.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#E8DFD8] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#2E2420] text-[#F3E5AB] hover:bg-[#3E302A] text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </motion.div>

      {/* Mandatory Explicit User Confirmation Dialog for Destructive / Mutating Workspace Operations */}
      <AnimatePresence>
        {confirmDialog.isOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    confirmDialog.actionType === 'clear'
                      ? 'bg-rose-100 text-rose-600'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {confirmDialog.actionType === 'clear' ? (
                    <Trash2 className="w-5 h-5" />
                  ) : (
                    <Sparkles className="w-5 h-5" />
                  )}
                </div>
                <h3 className="font-serif-display text-lg font-bold text-[#2E2420]">
                  {confirmDialog.title}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-[#5C4A3E] mb-6 leading-relaxed">
                {confirmDialog.description}
              </p>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
                    await confirmDialog.onConfirm();
                  }}
                  className={`px-4 py-2 rounded-xl text-white text-xs font-semibold shadow-sm cursor-pointer ${
                    confirmDialog.actionType === 'clear'
                      ? 'bg-rose-600 hover:bg-rose-700'
                      : 'bg-[#2E2420] hover:bg-[#43352F]'
                  }`}
                >
                  Confirm Proceed
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
