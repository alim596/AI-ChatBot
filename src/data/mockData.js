export const mockConversation = [
    {
      id: 'u1',
      sender: 'user',
      text: 'Hi there!',
      timestamp: '9:00 AM',
    },
    {
      id: 'a1',
      sender: 'ai',
      text: 'Hello! How can I help you today?',
      timestamp: '9:01 AM',
    },
    {
      id: 'u2',
      sender: 'user',
      text: 'What is the weather like?',
      timestamp: '9:02 AM',
    },
    {
      id: 'a2',
      sender: 'ai',
      text: 'It’s sunny and warm with a high of 25°C.',
      timestamp: '9:03 AM',
    },
  ];
  
  export const mockGraphNodes = [
    {
      id: '1',
      data: { label: 'User Greeting: "Hi there!"' },
      position: { x: 100, y: 0 },
    },
    {
      id: '2',
      data: { label: 'AI Greeting' },
      position: { x: 100, y: 120 },
    },
    {
      id: '3',
      data: { label: 'User asks about weather' },
      position: { x: 100, y: 240 },
    },
    {
      id: '4',
      data: { label: 'AI weather response' },
      position: { x: 100, y: 360 },
    },
  ];
  
  export const mockGraphEdges = [
    { id: 'e1-2', source: '1', target: '2', label: 'Responds' },
    { id: 'e2-3', source: '2', target: '3', label: 'Asks next' },
    { id: 'e3-4', source: '3', target: '4', label: 'Answers' },
  ];
  
  export const mockdata = [
    {
      id: 1,
      text: "Hi, how can I help you?",
    },
  ];
  
  