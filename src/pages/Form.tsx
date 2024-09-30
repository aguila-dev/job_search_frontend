import FormNextHandler from '@/components/FormSteps/FormHandler'
import {
  MultiSelectQuestion,
  SecondQuestion,
  ThirdQuestion,
} from '@/components/FormSteps/FormStepsNav'
import { DonQuixote, FormStep, FormStepResult } from '@aguila-dev/don-quixote'
import { useEffect, useState } from 'react'
import { z } from 'zod'

const Error = () => {
  return <div>Error</div>
}

enum Stepkey {
  Name = 'name',
  Rooms = 'rooms',
  Dimensions = 'dimensions',
}

export const formFlowOne = [
  {
    component: MultiSelectQuestion,
    name: Stepkey.Name,
    progressWeight: 1,
    schema: z.object({
      first: z.string().optional(),
      second: z.string().optional(),
      third: z.string().optional(),
      fourth: z.string().optional(),
      fifth: z.string().optional(),
    }),
  },
  {
    component: SecondQuestion,
    name: Stepkey.Rooms,
    progressWeight: 1,
    schema: z.object({
      rooms: z.number(),
    }),
  },
  {
    component: ThirdQuestion,
    name: Stepkey.Dimensions,
    progressWeight: 1,
    schema: z.object({
      sqFt: z.number(),
    }),
  },
]

const Form: React.FC = () => {
  const [testQuestionSteps, setTestQuestionSteps] =
    useState<FormStep[]>(formFlowOne)
  const [hydrateProfileData, setHydrateProfileData] = useState<
    Record<string, FormStepResult>
  >({})

  useEffect(() => {
    setTestQuestionSteps(formFlowOne)
    setHydrateProfileData({})
  }, [])

  const onFinishHandler = (data: any) => {
    console.log('Finished', data)
  }

  return (
    <DonQuixote
      Error={Error}
      FormFlow={testQuestionSteps}
      FormStepResults={hydrateProfileData}
      Loading={() => <div>Loading</div>}
      onError={(error: any) => {
        console.error('Caught error from Odyssey', {
          error,
        })
      }}
      onFinish={(data: any) => onFinishHandler(data)}
      onNext={FormNextHandler.runOnNextHandler}
    />
  )
}

export default Form
