// 自定义国际化配置
import { createI18n } from 'vue-i18n';

import { LanguageEnum } from '@/enums/LanguageEnum';
import zh_CN from '@/lang/zh_CN';
import en_US from '@/lang/en_US';
import Ja_JP from '@/lang/ja_JP';

/**
 * 获取当前语言
 * @returns zh-cn|en ...
 */
export const getLanguage = (): LanguageEnum => {
  const language = useStorage<LanguageEnum>('language', LanguageEnum.zh_CN);
  if (language.value) {
    return language.value;
  }
  return LanguageEnum.zh_CN;
};

const i18n = createI18n({
  globalInjection: true,
  allowComposition: true,
  legacy: false,
  locale: getLanguage(),
  messages: {
    zh_CN: zh_CN,
    en_US: en_US,
    ja_JP: Ja_JP
  }
});

export default i18n;

export type LanguageType = typeof zh_CN;
