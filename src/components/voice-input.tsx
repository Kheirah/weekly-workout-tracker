"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";

export default function VoiceInput({ userId }: { userId: number }) {
  const [isListening, setIsListening] = useState(false);
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
    body: { userId },
  });

  const startListening = () => {
    setIsListening(true);
    // Here you would typically start the speech recognition
    // For demonstration, we'll simulate voice input after 3 seconds
    setTimeout(() => {
      handleInputChange({
        target: { value: `User ${userId} did 20 pushups` },
      } as React.ChangeEvent<HTMLInputElement>);
      handleSubmit({
        preventDefault: () => {},
      } as React.FormEvent<HTMLFormElement>);
      setIsListening(false);
    }, 3000);
  };

  const stopListening = () => {
    setIsListening(false);
    // Here you would typically stop the speech recognition
  };

  return (
    <div>
      <Button
        onClick={isListening ? stopListening : startListening}
        variant="outline"
      >
        {isListening ? (
          <MicOff className="mr-2 h-4 w-4" />
        ) : (
          <Mic className="mr-2 h-4 w-4" />
        )}
        {isListening ? "Stop Listening" : "Start Voice Input"}
      </Button>
      <div className="mt-4">
        <h3 className="font-semibold">AI Response:</h3>
        <p>{messages[messages.length - 1]?.content || "No response yet"}</p>
      </div>
    </div>
  );
}
