"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Send, Paperclip } from "lucide-react"

interface Message {
  id: string
  sender: {
    id: string
    name: string
    avatar?: string
    role: string
  }
  content: string
  timestamp: string
  isRead: boolean
}

interface Conversation {
  id: string
  participant: {
    id: string
    name: string
    avatar?: string
    role: string
  }
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
}

export function MessagesPanel() {
  const [activeTab, setActiveTab] = useState("inbox")
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messageText, setMessageText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data
  const conversations: Conversation[] = [
    {
      id: "conv1",
      participant: {
        id: "user1",
        name: "John Smith",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Parent",
      },
      lastMessage: "When is the next parent-teacher meeting?",
      lastMessageTime: "10:30 AM",
      unreadCount: 2,
    },
    {
      id: "conv2",
      participant: {
        id: "user2",
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Teacher",
      },
      lastMessage: "I've shared the lesson plan for next week",
      lastMessageTime: "Yesterday",
      unreadCount: 0,
    },
    {
      id: "conv3",
      participant: {
        id: "user3",
        name: "Michael Brown",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Head Teacher",
      },
      lastMessage: "Please submit your class reports by Friday",
      lastMessageTime: "2 days ago",
      unreadCount: 1,
    },
    {
      id: "conv4",
      participant: {
        id: "user4",
        name: "Emily Davis",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Parent",
      },
      lastMessage: "Thank you for the update on Alex's progress",
      lastMessageTime: "3 days ago",
      unreadCount: 0,
    },
  ]

  const messages: Record<string, Message[]> = {
    conv1: [
      {
        id: "msg1",
        sender: {
          id: "user1",
          name: "John Smith",
          avatar: "/placeholder.svg?height=40&width=40",
          role: "Parent",
        },
        content: "Hello, I wanted to ask about the upcoming parent-teacher meeting.",
        timestamp: "10:15 AM",
        isRead: true,
      },
      {
        id: "msg2",
        sender: {
          id: "currentUser",
          name: "You",
          role: "Teacher",
        },
        content: "Hi John, we haven't set a date yet but it will likely be next month.",
        timestamp: "10:20 AM",
        isRead: true,
      },
      {
        id: "msg3",
        sender: {
          id: "user1",
          name: "John Smith",
          avatar: "/placeholder.svg?height=40&width=40",
          role: "Parent",
        },
        content: "When is the next parent-teacher meeting?",
        timestamp: "10:30 AM",
        isRead: false,
      },
    ],
    conv2: [
      {
        id: "msg4",
        sender: {
          id: "user2",
          name: "Sarah Johnson",
          avatar: "/placeholder.svg?height=40&width=40",
          role: "Teacher",
        },
        content: "I've shared the lesson plan for next week. Please take a look when you have time.",
        timestamp: "Yesterday",
        isRead: true,
      },
    ],
    conv3: [
      {
        id: "msg5",
        sender: {
          id: "user3",
          name: "Michael Brown",
          avatar: "/placeholder.svg?height=40&width=40",
          role: "Head Teacher",
        },
        content: "Please submit your class reports by Friday. We need to compile them for the board meeting.",
        timestamp: "2 days ago",
        isRead: false,
      },
    ],
    conv4: [
      {
        id: "msg6",
        sender: {
          id: "user4",
          name: "Emily Davis",
          avatar: "/placeholder.svg?height=40&width=40",
          role: "Parent",
        },
        content: "Thank you for the update on Alex's progress. We'll work on the areas you mentioned.",
        timestamp: "3 days ago",
        isRead: true,
      },
    ],
  }

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return

    // In a real app, you would send the message to the server
    console.log("Sending message:", messageText, "to conversation:", selectedConversation)

    // Clear the input
    setMessageText("")
  }

  return (
    <Card className="h-[calc(100vh-12rem)]">
      <CardHeader className="pb-3">
        <CardTitle>Messages</CardTitle>
        <CardDescription>Communicate with parents, teachers, and staff</CardDescription>
      </CardHeader>
      <CardContent className="p-0 h-[calc(100%-5rem)]">
        <div className="flex h-full border-t">
          {/* Conversations List */}
          <div className="w-1/3 border-r h-full flex flex-col">
            <div className="p-3 border-b">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search messages..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button size="icon" variant="ghost">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Tabs defaultValue="inbox" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <div className="px-3 pt-2">
                <TabsList className="w-full">
                  <TabsTrigger value="inbox" className="flex-1">
                    Inbox
                  </TabsTrigger>
                  <TabsTrigger value="sent" className="flex-1">
                    Sent
                  </TabsTrigger>
                  <TabsTrigger value="archived" className="flex-1">
                    Archived
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="inbox" className="flex-1 overflow-auto p-0 m-0">
                <div className="divide-y">
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-3 cursor-pointer hover:bg-gray-50 ${
                        selectedConversation === conversation.id ? "bg-gray-50" : ""
                      }`}
                      onClick={() => setSelectedConversation(conversation.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={conversation.participant.avatar || "/placeholder.svg"}
                            alt={conversation.participant.name}
                          />
                          <AvatarFallback>{conversation.participant.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium truncate">{conversation.participant.name}</p>
                            <span className="text-xs text-gray-500">{conversation.lastMessageTime}</span>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                            {conversation.unreadCount > 0 && (
                              <Badge
                                variant="default"
                                className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full"
                              >
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-1">{conversation.participant.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="sent" className="flex-1 overflow-auto p-0 m-0">
                <div className="p-8 text-center text-gray-500">
                  <p>Sent messages will appear here</p>
                </div>
              </TabsContent>

              <TabsContent value="archived" className="flex-1 overflow-auto p-0 m-0">
                <div className="p-8 text-center text-gray-500">
                  <p>Archived messages will appear here</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Message Content */}
          <div className="w-2/3 flex flex-col h-full">
            {selectedConversation ? (
              <>
                {/* Conversation Header */}
                <div className="p-3 border-b flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={
                          conversations.find((c) => c.id === selectedConversation)?.participant.avatar ||
                          "/placeholder.svg"
                        }
                        alt={conversations.find((c) => c.id === selectedConversation)?.participant.name}
                      />
                      <AvatarFallback>
                        {conversations
                          .find((c) => c.id === selectedConversation)
                          ?.participant.name.slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {conversations.find((c) => c.id === selectedConversation)?.participant.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {conversations.find((c) => c.id === selectedConversation)?.participant.role}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Button variant="ghost" size="sm">
                      View Profile
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-auto p-4 space-y-4">
                  {messages[selectedConversation]?.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender.id === "currentUser" ? "justify-end" : "justify-start"}`}
                    >
                      <div className="flex items-start space-x-2 max-w-[70%]">
                        {message.sender.id !== "currentUser" && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={message.sender.avatar || "/placeholder.svg"} alt={message.sender.name} />
                            <AvatarFallback>{message.sender.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                        )}
                        <div>
                          <div
                            className={`rounded-lg p-3 ${
                              message.sender.id === "currentUser"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{message.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-3 border-t">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <Button size="icon" onClick={handleSendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-center p-8">
                <div>
                  <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                  <p className="text-gray-500">Choose a conversation from the list to view messages</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
