import { CheckCircle2, Plus, Trash2Icon } from 'lucide-react'
import { Button } from './ui/button'
import { DialogTrigger } from './ui/dialog'
import { InOrbitIcon } from './in-orbit-icon'
import { Progress, ProgressIndicator } from './ui/progress-bar'
import { Separator } from './ui/separator'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getSummary } from '../http/get-summary'
import dayjs from 'dayjs'
import ptBR from 'dayjs/locale/pt-br'
import { PendingGoals } from './pending.goals'
import { deleteGoal } from '../http/delete-goal'

dayjs.locale(ptBR)

export function Summary() {
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ['summary'],
    queryFn: getSummary,
    staleTime: 1000 * 60,
  })

  if (!data) {
    return null
  }
  const fisrtDayOfWeek = dayjs().startOf('week').format('D')
  const lastDayOfWeek = dayjs().endOf('week').format('D')
  const month = dayjs().startOf('week').format('MMMM')

  const completedPercent = Math.round(
    (data?.summary.completed * 100) / data?.summary.total
  )

  async function handelDeleteCompletion(goalCompletionId: string) {
    await deleteGoal({ goalCompletionId })
    queryClient.invalidateQueries({ queryKey: ['summary'] })
    await getSummary()
  }

  return (
    <div className="py-10 max-w-[480px] px-5 mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <InOrbitIcon />
          <span className="text-lg font-semibold">
            {fisrtDayOfWeek} a {lastDayOfWeek} de {month}
          </span>
        </div>

        <DialogTrigger asChild>
          <Button size="sm">
            <Plus className="size-4" />
            Cadastrar meta
          </Button>
        </DialogTrigger>
      </div>

      <div className="flex flex-col gap-3">
        <Progress value={8} max={15}>
          <ProgressIndicator style={{ width: `${completedPercent}%` }} />
        </Progress>

        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>
            Você completou{' '}
            <span className="text-zinc-100">{data?.summary.completed}</span> de{' '}
            <span className="text-zinc-100">{data?.summary.total}</span> metas
            nessa semana.
          </span>
          <span>{completedPercent}%</span>
        </div>
      </div>

      <Separator />

      <PendingGoals />

      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-medium">Sua semana</h2>

        {data?.summary?.goalsPerDay &&
          Object.entries(data.summary?.goalsPerDay).map(([date, goals]) => {
            const weekDay = dayjs(date).format('dddd')
            const day = dayjs(date).format('D [de] MMMM')
            return (
              <div className="flex flex-col gap-4" key={date}>
                <h3 className="font-medium">
                  <span className="font-medium capitalize">{weekDay}</span>{' '}
                  <span className="text-zinc-400 text-xs">({day})</span>
                </h3>

                {goals.map(goal => {
                  const time = dayjs(goal.completedAt).format('hh:mm')
                  return (
                    <ul className="flex flex-col gap-3" key={goal.id}>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-pink-500" />
                        <span className="text-sm text-zinc-400">
                          Você completou "
                          <span className="text-zinc-100">{goal.title}</span>"
                          às <span className="text-zinc-100">{time}h</span>
                        </span>
                        <span className="text-sm text-zinc-400">•</span>
                        <Trash2Icon
                          size={15}
                          className="text-zinc-300 hover:text-red-500  hover:cursor-pointer"
                          onClick={() => handelDeleteCompletion(goal.id)}
                        >
                          cancelar
                        </Trash2Icon>
                      </li>
                    </ul>
                  )
                })}
              </div>
            )
          })}
      </div>
    </div>
  )
}
