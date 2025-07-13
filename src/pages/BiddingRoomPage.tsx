import React from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '../components/ui';

const BiddingRoomPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();

  // TODO: Fetch bidding room details using roomId and display bidding UI

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
      <Card className="w-full max-w-2xl mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Bidding Room</h1>
        <p className="mb-2">Room ID: <span className="font-mono text-primary-600">{roomId}</span></p>
        <p className="text-gray-600">(Bidding room details and live bidding UI will appear here.)</p>
      </Card>
    </div>
  );
};

export default BiddingRoomPage;
