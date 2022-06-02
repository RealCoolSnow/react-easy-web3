import { DefaultLanguage } from '@/locale'
import { createModel } from '@rematch/core'
import { RootModel } from '.'

export type CommonState = {
  language: string
}

export const common = createModel<RootModel>()({
  state: {
    language: DefaultLanguage
  } as CommonState,
  reducers: {
    SET_LANGUAGE(state, language: string) {
      return {
        ...state,
        language
      }
    }
  },
  effects: (dispatch) => ({
    async setLanguage(payload: string) {
      dispatch.common.SET_LANGUAGE(payload)
    }
  })
})
