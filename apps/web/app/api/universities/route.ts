import { NextResponse } from 'next/server';

const universities = [
  { id: '1', name: 'Massachusetts Institute of Technology' },
  { id: '2', name: 'Stanford University' },
  { id: '3', name: 'Harvard University' },
  { id: '4', name: 'University of California, Berkeley' },
  { id: '5', name: 'California Institute of Technology' },
  { id: '6', name: 'University of Oxford' },
  { id: '7', name: 'University of Cambridge' },
  { id: '8', name: 'Princeton University' },
  { id: '9', name: 'Yale University' },
  { id: '10', name: 'Columbia University' },
  { id: '11', name: 'University of Chicago' },
  { id: '12', name: 'Cornell University' },
  { id: '13', name: 'University of Pennsylvania' },
  { id: '14', name: 'University of Michigan' },
  { id: '15', name: 'University of Toronto' },
  { id: '16', name: 'Imperial College London' },
  { id: '17', name: 'ETH Zurich' },
  { id: '18', name: 'University of California, Los Angeles' },
  { id: '19', name: 'University of Washington' },
  { id: '20', name: 'New York University' },
];

export async function GET() {
  try {
    const response = await fetch('http://localhost:3002/api/university');
    if (!response.ok) {
      throw new Error('Failed to fetch universities from external API');
    }
    const externalUniversities = await response.json();
    return NextResponse.json(externalUniversities);
  } catch (error) {
    console.error('Error fetching universities from external API:', error);
    return NextResponse.json(universities);

  }
}
