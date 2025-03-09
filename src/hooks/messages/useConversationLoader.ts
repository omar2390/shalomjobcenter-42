
import { useState, useEffect } from 'react';
import { Conversation, Message, ADMIN_USER, WELCOME_BOT } from '@/components/messages/types';

export const useConversationLoader = (userId: string | undefined) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  // Load conversations from localStorage
  useEffect(() => {
    if (userId) {
      const savedConversations = localStorage.getItem(`conversations_${userId}`);
      
      if (savedConversations) {
        try {
          // Convert date strings to Date objects
          const parsedConversations = JSON.parse(savedConversations, (key, value) => {
            if (key === 'timestamp' && typeof value === 'string') {
              return new Date(value);
            }
            return value;
          });
          
          setConversations(parsedConversations);
          
          // Retrieve selected conversation from session storage if available
          const lastSelectedId = sessionStorage.getItem(`selected_conversation_${userId}`);
          
          if (lastSelectedId) {
            const lastSelected = parsedConversations.find(c => c.id === lastSelectedId);
            if (lastSelected) {
              setSelectedConversation(lastSelected);
            } else if (parsedConversations.length > 0) {
              setSelectedConversation(parsedConversations[0]);
              sessionStorage.setItem(`selected_conversation_${userId}`, parsedConversations[0].id);
            }
          } else if (parsedConversations.length > 0) {
            setSelectedConversation(parsedConversations[0]);
            sessionStorage.setItem(`selected_conversation_${userId}`, parsedConversations[0].id);
          }
        } catch (error) {
          console.error("Erreur lors de la lecture des conversations:", error);
          initializeDefaultConversations(userId);
        }
      } else {
        // No conversations found, initialize with default conversations
        initializeDefaultConversations(userId);
      }
    }
  }, [userId]);

  // Save conversations to localStorage when they change
  useEffect(() => {
    if (userId && conversations.length > 0) {
      localStorage.setItem(`conversations_${userId}`, JSON.stringify(conversations));
    }
  }, [conversations, userId]);
  
  // Remember selected conversation
  useEffect(() => {
    if (userId && selectedConversation) {
      sessionStorage.setItem(`selected_conversation_${userId}`, selectedConversation.id);
    }
  }, [selectedConversation, userId]);

  // Initialize default conversations for a new user
  const initializeDefaultConversations = (userId: string) => {
    if (!userId) return;

    // Create welcome conversation with bot
    const welcomeMessage: Message = {
      id: `welcome-${Date.now()}`,
      content: `Bienvenue ${userId} sur SHALOM JOB CENTER ! Nous sommes ravis de vous accueillir. N'hésitez pas à parcourir les offres d'emploi et les logements disponibles. Si vous avez des questions, contactez notre équipe d'assistance.`,
      timestamp: new Date(),
      read: false,
      sender: 'system',
    };

    // Create conversation with admin
    const adminWelcomeMessage: Message = {
      id: `admin-welcome-${Date.now()}`,
      content: `Bonjour ${userId}, je suis l'administrateur de la plateforme. N'hésitez pas à me contacter si vous avez des questions.`,
      timestamp: new Date(),
      read: false,
      sender: 'admin',
    };

    // Créer au moins 5 conversations pour avoir plus de données d'exemple
    const testUsers = [
      {
        id: 'user1',
        name: 'Jean Dupont',
        avatar: '/placeholder.svg',
        role: 'user' as const
      },
      {
        id: 'user2',
        name: 'Marie Martin',
        avatar: '/placeholder.svg',
        role: 'user' as const
      },
      {
        id: 'user3',
        name: 'Thomas Bernard',
        avatar: '/placeholder.svg',
        role: 'user' as const
      }
    ];

    // Créer des conversations avec des utilisateurs de test
    const testConversations = testUsers.map(user => {
      const testMessage: Message = {
        id: `test-${Date.now()}-${user.id}`,
        content: `Bonjour, je m'appelle ${user.name}. Pouvez-vous m'aider avec une question sur le site?`,
        timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000), // Random time in the last 24h
        read: Math.random() > 0.5,
        sender: 'user',
      };

      return {
        id: `conv-${user.id}-${Date.now()}`,
        with: user,
        lastMessage: {
          content: testMessage.content,
          timestamp: testMessage.timestamp,
          read: testMessage.read,
          sender: 'user',
        },
        messages: [testMessage],
      };
    });

    const initialConversations: Conversation[] = [
      {
        id: `welcome-${Date.now()}`,
        with: WELCOME_BOT,
        lastMessage: {
          content: welcomeMessage.content,
          timestamp: welcomeMessage.timestamp,
          read: welcomeMessage.read,
          sender: 'system',
        },
        messages: [welcomeMessage],
      },
      {
        id: `admin-${Date.now()}`,
        with: ADMIN_USER,
        lastMessage: {
          content: adminWelcomeMessage.content,
          timestamp: adminWelcomeMessage.timestamp,
          read: adminWelcomeMessage.read,
          sender: 'admin',
        },
        messages: [adminWelcomeMessage],
      },
      ...testConversations
    ];

    setConversations(initialConversations);
    setSelectedConversation(initialConversations[0]);
    
    // Save to localStorage immediately
    localStorage.setItem(`conversations_${userId}`, JSON.stringify(initialConversations));
    sessionStorage.setItem(`selected_conversation_${userId}`, initialConversations[0].id);
  };

  return {
    conversations,
    setConversations,
    selectedConversation,
    setSelectedConversation,
    initializeDefaultConversations
  };
};
