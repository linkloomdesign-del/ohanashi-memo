'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import {
  Conversation,
  ChatMessage,
  ConversationCard,
  Memo,
  FamilyMessage,
  AppUsageLog,
  Profile,
} from '@/types';
import {
  mockConversations,
  mockConversationCards,
  mockMemos,
  mockFamilyMessages,
  mockUsageLogs,
  familyProfiles as initialProfiles,
} from '@/data/mockData';
import { generateId } from '@/lib/utils';
import { isSupabaseConfigured } from '@/lib/supabase';
import * as dataService from '@/services/data/dataService';

const STORAGE_KEY = 'ohanashi-memo-data';

function saveToLocalStorage(data: {
  conversations: Conversation[];
  conversationCards: ConversationCard[];
  memos: Memo[];
  familyMessages: FamilyMessage[];
  usageLogs: AppUsageLog[];
}) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage full or unavailable
  }
}

function loadFromLocalStorage(): {
  conversations: Conversation[];
  conversationCards: ConversationCard[];
  memos: Memo[];
  familyMessages: FamilyMessage[];
  usageLogs: AppUsageLog[];
} | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);

    // Restore Date objects from JSON strings
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const restoreDates = (items: any[], dateFields: string[]) =>
      items.map((item: any) => {
        const restored = { ...item };
        for (const field of dateFields) {
          if (restored[field]) restored[field] = new Date(restored[field]);
        }
        return restored;
      });

    data.conversations = restoreDates(data.conversations, ['startedAt', 'endedAt', 'createdAt']).map(
      (c: Conversation) => ({
        ...c,
        messages: restoreDates(c.messages || [], ['createdAt']),
      })
    );
    data.conversationCards = restoreDates(data.conversationCards, ['createdAt']);
    data.memos = restoreDates(data.memos, ['createdAt', 'updatedAt']);
    data.familyMessages = restoreDates(data.familyMessages, ['createdAt']);
    data.usageLogs = restoreDates(data.usageLogs, ['createdAt']);

    return data;
  } catch {
    return null;
  }
}

interface AppState {
  conversations: Conversation[];
  conversationCards: ConversationCard[];
  memos: Memo[];
  familyMessages: FamilyMessage[];
  usageLogs: AppUsageLog[];
  profiles: Profile[];
  isLoading: boolean;
  addConversation: (conversation: Conversation) => void;
  addMessageToConversation: (conversationId: string, message: ChatMessage) => void;
  addConversationCard: (card: ConversationCard) => void;
  addMemo: (memo: Memo) => void;
  updateMemoStatus: (memoId: string, status: Memo['status']) => void;
  addFamilyMessage: (message: FamilyMessage) => void;
  addUsageLog: (feature: AppUsageLog['feature'], action: AppUsageLog['action']) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const useSupabase = isSupabaseConfigured();

  // Start with empty arrays to avoid hydration mismatch (Date objects differ server vs client)
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversationCards, setConversationCards] = useState<ConversationCard[]>([]);
  const [memos, setMemos] = useState<Memo[]>([]);
  const [familyMessages, setFamilyMessages] = useState<FamilyMessage[]>([]);
  const [usageLogs, setUsageLogs] = useState<AppUsageLog[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const initialized = useRef(false);

  // Load data on client mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (useSupabase) {
      async function loadData() {
        const [convs, cards, m, fm, logs, profs] = await Promise.all([
          dataService.fetchConversations(),
          dataService.fetchConversationCards(),
          dataService.fetchMemos(),
          dataService.fetchFamilyMessages(),
          dataService.fetchUsageLogs(),
          dataService.fetchProfiles(),
        ]);
        setConversations(convs);
        setConversationCards(cards);
        setMemos(m);
        setFamilyMessages(fm);
        setUsageLogs(logs);
        setProfiles(profs);
        setIsLoading(false);
      }
      loadData();
    } else {
      // Try localStorage first, fallback to mock data
      const saved = loadFromLocalStorage();
      if (saved && (saved.conversations.length > 0 || saved.memos.length > 0 || saved.usageLogs.length > 0)) {
        setConversations(saved.conversations);
        setConversationCards(saved.conversationCards);
        setMemos(saved.memos);
        setFamilyMessages(saved.familyMessages);
        setUsageLogs(saved.usageLogs);
      } else {
        setConversations(mockConversations);
        setConversationCards(mockConversationCards);
        setMemos(mockMemos);
        setFamilyMessages(mockFamilyMessages);
        setUsageLogs(mockUsageLogs);
      }
      setProfiles(initialProfiles);
      setIsLoading(false);
    }
  }, [useSupabase]);

  // Auto-save to localStorage whenever data changes (skip initial empty state)
  useEffect(() => {
    if (isLoading || useSupabase) return;
    saveToLocalStorage({ conversations, conversationCards, memos, familyMessages, usageLogs });
  }, [conversations, conversationCards, memos, familyMessages, usageLogs, isLoading, useSupabase]);

  const addConversation = useCallback((conversation: Conversation) => {
    setConversations((prev) => [conversation, ...prev]);
    if (useSupabase) dataService.insertConversation(conversation);
  }, [useSupabase]);

  const addMessageToConversation = useCallback(
    (conversationId: string, message: ChatMessage) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId
            ? { ...c, messages: [...c.messages, message] }
            : c
        )
      );
    },
    []
  );

  const addConversationCard = useCallback((card: ConversationCard) => {
    setConversationCards((prev) => [card, ...prev]);
    if (useSupabase) dataService.insertConversationCard(card);
  }, [useSupabase]);

  const addMemo = useCallback((memo: Memo) => {
    setMemos((prev) => [memo, ...prev]);
    if (useSupabase) dataService.insertMemo(memo);
  }, [useSupabase]);

  const updateMemoStatus = useCallback((memoId: string, status: Memo['status']) => {
    setMemos((prev) =>
      prev.map((m) => (m.id === memoId ? { ...m, status, updatedAt: new Date() } : m))
    );
    if (useSupabase) dataService.updateMemo(memoId, status);
  }, [useSupabase]);

  const addFamilyMessage = useCallback((message: FamilyMessage) => {
    setFamilyMessages((prev) => [message, ...prev]);
    if (useSupabase) dataService.insertFamilyMessage(message);
  }, [useSupabase]);

  const addUsageLog = useCallback((feature: AppUsageLog['feature'], action: AppUsageLog['action']) => {
    const log: AppUsageLog = {
      id: generateId(),
      userId: 'mother-1',
      feature,
      action,
      createdAt: new Date(),
    };
    setUsageLogs((prev) => [log, ...prev]);
    if (useSupabase) dataService.insertUsageLog(log);
  }, [useSupabase]);

  return (
    <AppContext.Provider
      value={{
        conversations,
        conversationCards,
        memos,
        familyMessages,
        usageLogs,
        profiles,
        isLoading,
        addConversation,
        addMessageToConversation,
        addConversationCard,
        addMemo,
        updateMemoStatus,
        addFamilyMessage,
        addUsageLog,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
