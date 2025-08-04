import { useDictStore } from '@/store/modules/dict';
import { getDicts } from '@/api/system/dict/data';

export interface DictDataOption {
  label: string;
  value: string;
  elTagType?: string;
  elTagClass?: string;
}

export const useDict = async (...args: string[]): Promise<{ [key: string]: DictDataOption[] }> => {
  const store = useDictStore();
  const result: { [key: string]: DictDataOption[] } = {};

  await Promise.all(
    args.map(async (dictType) => {
      const cached = store.getDict(dictType);
      if (cached) {
        result[dictType] = cached;
      } else {
        const resp = await getDicts(dictType);
        result[dictType] = resp.data.map(
          (p): DictDataOption => ({
            label: p.dictLabel,
            value: p.dictValue,
            elTagType: p.listClass,
            elTagClass: p.cssClass
          })
        );
        store.setDict(dictType, result[dictType]);
      }
    })
  );

  return result;
};
