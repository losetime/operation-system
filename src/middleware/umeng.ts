import { REACT_APP_ENV, QA_ENV, PROD_ENV } from '@/enums/envEnum'
import { UMeng } from '@/enums/pluginEnum'

export const Umeng = (): void => {
  if (REACT_APP_ENV === QA_ENV || REACT_APP_ENV === PROD_ENV) {
    const el = document.createElement('script')
    el.type = 'text/javascript'
    el.async = true
    const ref: any = document.getElementsByTagName('script')[0]
    ref.parentNode.insertBefore(el, ref)
    el.src = REACT_APP_ENV === PROD_ENV ? UMeng.PROD : UMeng.QA
  }
}
