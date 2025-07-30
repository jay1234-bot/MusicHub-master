"use client"
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";

export default function VoiceSearch({ onVoiceResult }) {
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
            recognitionRef.current = new window.webkitSpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setIsListening(false);
                onVoiceResult(transcript);
            };

            recognitionRef.current.onerror = () => {
                setIsListening(false);
            };
        }
    }, [onVoiceResult]);

    const startListening = () => {
        if (recognitionRef.current) {
            setIsListening(true);
            recognitionRef.current.start();
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            setIsListening(false);
            recognitionRef.current.stop();
        }
    };

    return (
        <Button
            size="icon"
            variant="ghost"
            onClick={isListening ? stopListening : startListening}
            className={`h-8 w-8 rounded-lg transition-all ${
                isListening 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'hover:bg-purple-500/10 hover:text-purple-500'
            }`}
        >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
    );
} 