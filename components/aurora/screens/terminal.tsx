'use client';
import { useAurora } from '@/context/aurora-context';
import { useState, useEffect, useRef } from 'react';

export default function TerminalApp({ data }: { data?: { commandToRun?: string } }) {
  const { userSettings } = useAurora();
  const [history, setHistory] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const endOfHistoryRef = useRef<HTMLDivElement>(null);

  const user = userSettings.username;

  const handleCommand = (command: string) => {
    let output = '';
    const newHistory = [...history, `C:\\Users\\${user}> ${command}`];

    if (command.toLowerCase() === 'help') {
      output = 'Available commands: help, clear, exit';
    } else if (command.toLowerCase() === 'clear') {
      setHistory([]);
      return;
    } else if (command.toLowerCase() === 'exit') {
        // This should be handled by the window close button, but we can add it here too
        output = 'Use the close button to exit the terminal.';
    } else {
      output = `Command not found: ${command}`;
    }
    setHistory([...newHistory, output]);
  };

  useEffect(() => {
    if (data?.commandToRun) {
      handleCommand(data.commandToRun);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    endOfHistoryRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    }
  };

  return (
    <div className="h-full w-full bg-black font-code text-white p-2" onClick={() => document.getElementById('terminal-input')?.focus()}>
      <div className="overflow-y-auto h-full">
        {history.map((line, i) => (
          <p key={i} className="whitespace-pre-wrap">{line}</p>
        ))}
        <div className="flex">
          <span>{`C:\\Users\\${user}> `}</span>
          <input
            id="terminal-input"
            type="text"
            className="bg-transparent border-none outline-none text-white w-full"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </div>
        <div ref={endOfHistoryRef} />
      </div>
    </div>
  );
}
