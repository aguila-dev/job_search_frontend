import { FormStepResults } from '@aguila-dev/don-quixote'

class FormNextHandler {
  private static onNextHandlers: Record<
    string,
    (data: FormStepResults) => void
  > = {}

  public static registerOnNextHandler(
    key: string,
    callback: (data: FormStepResults) => void
  ) {
    this.onNextHandlers[key] = callback
  }

  public static runOnNextHandler(key: string, data: FormStepResults) {
    const handler = FormNextHandler.onNextHandlers[key]
    if (handler) {
      handler(data)
    }
  }
}

export default FormNextHandler
