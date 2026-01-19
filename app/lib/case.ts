'use client'

const backendUrl = process.env.NEXT_PUBLIC_CASE_RULE

if (!backendUrl) {
  throw new Error('NEXT_PUBLIC_CASE_RULE is not defined')
}

/* -------------------- CREATE -------------------- */
export const addCase = async (
  title: string,
  description: string,
  user_id: string
) => {
  const res = await fetch(`${backendUrl}/case`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, description, user_id }),
  })

  if (!res.ok) {
    throw new Error('Failed to add case')
  }

  return res.json()
}

/* -------------------- READ ONE -------------------- */
export const getCase = async (case_id: string) => {
  const res = await fetch(`${backendUrl}/case/${case_id}`, {
    method: 'GET',
  })

  if (!res.ok) {
    throw new Error('Failed to fetch case')
  }

  return res.json()
}

/* -------------------- READ ALL -------------------- */
export const getAllCase = async (user_id: string) => {
  const res = await fetch(`${backendUrl}/cases/${user_id}`, {
    method: 'GET',
  })

  if (!res.ok) {
    throw new Error('Failed to fetch cases')
  }

  return res.json()
}

/* -------------------- DELETE -------------------- */
export const deleteCase = async (case_id: string) => {
  const res = await fetch(`${backendUrl}/case/${case_id}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    throw new Error('Failed to delete case')
  }

  return res.json()
}

/* -------------------- SUMMARIES -------------------- */
export const getCaseSummaries = async (
  user_id: string,
  lang: string
) => {
  const res = await fetch(
    `${backendUrl}/case/summaries/${user_id}?lang=${encodeURIComponent(lang)}`,
    {
      method: 'GET',
    }
  )

  if (!res.ok) {
    throw new Error('Failed to fetch summaries')
  }

  return res.json()
}
