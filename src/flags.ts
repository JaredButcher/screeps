
type flagTypeConst = [ColorConstant, ColorConstant];

export const flagTypes: {[id: string]: flagTypeConst} = {
    constructionSite: [COLOR_GREY, COLOR_GREY]
}

export function isFlagOfType(flag: Flag, flagType: string): boolean{
    return flag.color == flagTypes[flagType][0] && flag.secondaryColor == flagTypes[flagType][1];
}