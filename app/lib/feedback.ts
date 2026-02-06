

export const giveFeedback = async (feedback: string) => {
    const { error } = await supabase.from('feedback').insert({ feedback })
    if (error) throw error
}