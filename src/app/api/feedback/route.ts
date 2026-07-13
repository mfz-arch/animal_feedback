import { NextResponse } from 'next/server';
import { collection, getDocs, addDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET() {
  try {
    const feedbacksRef = collection(db, 'feedbacks');
    const q = query(feedbacksRef, orderBy('date', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const feedbacks = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(feedbacks);
  } catch (error) {
    console.error('Failed to fetch feedback', error);
    return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { animalId, name, text, date } = body;

    if (!animalId || !name || !text || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const feedbacksRef = collection(db, 'feedbacks');
    const docRef = await addDoc(feedbacksRef, {
      animalId,
      name,
      text,
      date
    });

    const newFeedback = {
      id: docRef.id,
      animalId,
      name,
      text,
      date
    };

    return NextResponse.json(newFeedback, { status: 201 });
  } catch (error) {
    console.error('Failed to post feedback', error);
    return NextResponse.json({ error: 'Failed to post feedback' }, { status: 500 });
  }
}
