
import React from 'react';
import { Conversation } from '@/components/messages/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import AdminMessageInput from './AdminMessageInput';
import { OnlineStatusIndicator } from './OnlineStatusIndicator';
import { ArrowLeft, MoreVertical, Phone, Video, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EnhancedConversationViewProps {
  conversation: Conversation | null;
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
  isSending: boolean;
  isOnline: boolean;
  quickResponses: string[];
  onQuickResponseSelect: (text: string) => void;
  onAddQuickResponse: (text: string) => void;
  onRemoveQuickResponse: (index: number) => void;
  isPreviewMode: boolean;
  previewMessage: () => void;
  sendFromPreview: () => void;
  cancelPreview: () => void;
}

export const EnhancedConversationView: React.FC<EnhancedConversationViewProps> = ({
  conversation,
  newMessage,
  setNewMessage,
  handleSendMessage,
  isSending,
  isOnline,
  quickResponses,
  onQuickResponseSelect,
  onAddQuickResponse,
  onRemoveQuickResponse,
  isPreviewMode,
  previewMessage,
  sendFromPreview,
  cancelPreview
}) => {
  if (!conversation) {
    return (
      <div className="col-span-2 flex flex-col h-full justify-center items-center border rounded-r-lg bg-gray-50">
        <div className="text-center p-4">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Sélectionnez une conversation</h3>
          <p className="text-gray-500">
            Choisissez une conversation dans la liste pour commencer à échanger des messages.
          </p>
        </div>
      </div>
    );
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  const renderMessageStatus = (message: any) => {
    if (message.sender !== 'admin') return null;
    
    if (message.read) {
      return (
        <span className="whatsapp-tick whatsapp-read-tick">
          <Check className="h-3 w-3 inline" />
          <Check className="h-3 w-3 inline -ml-1" />
        </span>
      );
    } else {
      return (
        <span className="whatsapp-tick whatsapp-single-tick">
          <Check className="h-3 w-3 inline" />
        </span>
      );
    }
  };

  return (
    <div className="col-span-2 flex flex-col h-full whatsapp-container">
      <div className="whatsapp-header">
        <div className="flex items-center flex-1">
          <div className="relative">
            <Avatar className="whatsapp-user-avatar">
              <AvatarImage src={conversation.with.avatar} />
              <AvatarFallback>
                {conversation.with.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {isOnline && <div className="whatsapp-online-indicator"></div>}
            {!isOnline && <div className="whatsapp-offline-indicator"></div>}
          </div>
          
          <div className="whatsapp-user-info">
            <h3 className="font-semibold text-white">{conversation.with.name}</h3>
            <div className="flex items-center gap-2">
              <div className="text-xs text-white/80">
                {isOnline ? 'En ligne' : 'Hors ligne'}
              </div>
              {conversation.with.role && (
                <Badge variant="outline" className="text-xs bg-emerald-700 text-white border-emerald-600">
                  {conversation.with.role}
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-white">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div className="whatsapp-message-area">
        <div className="space-y-1">
          {conversation.messages.map((message) => (
            <div 
              key={message.id}
              className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender !== 'admin' && (
                <Avatar className="h-8 w-8 mr-2 mt-1">
                  <AvatarImage src={conversation.with.avatar} />
                  <AvatarFallback>
                    {conversation.with.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              )}
              <div 
                className={`whatsapp-message ${
                  message.sender === 'admin' 
                    ? 'whatsapp-user-message' 
                    : 'whatsapp-other-message'
                }`}
              >
                {message.sender === 'admin' && <div className="whatsapp-tail-out"></div>}
                {message.sender !== 'admin' && <div className="whatsapp-tail-in"></div>}
                
                <p className="whitespace-pre-wrap">{message.content}</p>
                
                <div className="whatsapp-message-time">
                  {formatTime(message.timestamp)}
                  {renderMessageStatus(message)}
                  {!message.read && message.sender !== 'admin' && (
                    <span className="ml-1 font-medium text-gray-600">• Non lu</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <AdminMessageInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSendMessage={handleSendMessage}
        conversation={conversation}
        isSending={isSending}
        quickResponses={quickResponses}
        onQuickResponseSelect={onQuickResponseSelect}
        onAddQuickResponse={onAddQuickResponse}
        onRemoveQuickResponse={onRemoveQuickResponse}
        isPreviewMode={isPreviewMode}
        previewMessage={previewMessage}
        sendFromPreview={sendFromPreview}
        cancelPreview={cancelPreview}
      />
    </div>
  );
};
