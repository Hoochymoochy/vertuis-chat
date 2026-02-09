'use client'

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

if (!backendUrl) {
  throw new Error('NEXT_PUBLIC_BACKEND_URL is not defined')
}

export const addFeedback = async (
    id: string, 
    feedback: string, 
    message: string, 
    reason?: string  // Already optional in TS
) => {
  try {
    console.log('📤 Sending feedback:', { id, feedback, message, reason })
    
    // Build request body dynamically
    const body: Record<string, string> = {
      message_id: id,
      type: feedback,
      message,
    }
    
    // Only include reason if provided
    if (reason) {
      body.reason = reason
    }
    
    const res = await fetch(`${backendUrl}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    console.log('📥 Response status:', res.status)

    if (!res.ok) {
      const errorText = await res.text()
      console.error('❌ Feedback error:', errorText)
      throw new Error(`Failed to add feedback: ${res.status} - ${errorText}`)
    }

    const data = await res.json()
    console.log('✅ Feedback added successfully:', data)
    return data
  } catch (error) {
    console.error('❌ Error in addFeedback:', error)
    throw error
  }
}