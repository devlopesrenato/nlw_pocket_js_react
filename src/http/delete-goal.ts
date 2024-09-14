export interface DeleteGoalRequest {
  goalCompletionId: string
}

export async function deleteGoal({
  goalCompletionId,
}: DeleteGoalRequest): Promise<void> {
  const response = await fetch(
    `http://localhost:3333/completions/${goalCompletionId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) {
    throw new Error('Error while deleting the goal')
  }
}
