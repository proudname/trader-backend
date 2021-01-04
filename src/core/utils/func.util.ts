import _ from 'lodash';


export const setDefaults = (defaultValue: any) => {
  return (value: any) => _.isNil(value) ? defaultValue : value;
}