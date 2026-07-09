export const VsYearVersion = {
  2022: '17.0',
  2019: '16.0',
  2017: '15.0',
  2015: '14.0',
  2013: '12.0',
};

export function vsversion_to_versionnumber(vsversion) {
  if (Object.values(VsYearVersion).includes(vsversion)) {
    return vsversion;
  } else {
    if (vsversion in VsYearVersion) {
      return VsYearVersion[vsversion];
    }
  }
  return vsversion;
}

export function vsversion_to_year(vsversion) {
  if (Object.keys(VsYearVersion).includes(vsversion)) {
    return vsversion;
  } else {
    for (const [year, ver] of Object.entries(VsYearVersion)) {
      if (ver === vsversion) {
        return year;
      }
    }
  }
  return vsversion;
}
