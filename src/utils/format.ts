const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

// 2018-11-11T07:53:15.403Z => 2018-11-11 15:53:15
export const formatJSONDate = (jsonDate: string): string => {
  return new Date(+new Date(new Date(jsonDate).toJSON()) + 8 * 3600 * 1000)
    .toISOString()
    .replace(/T/g, " ")
    .replace(/\.[\d]{3}Z/, "");
};

// 2018-11-11 15:53:15 => November 11, 2018
export const formatCommonDate = (date: string): string => {
  const dataList = date.split(" ")[0].split("-");
  return `${months[parseInt(dataList[1], 10) - 1]} ${dataList[2]}, ${dataList[0]}`;
};

export const formatAbout = (data: string) => {
  let projectExperienceArr = data
    .replace(/summary_end\r\n/g, "")
    .split("### ")
    .filter(i => i.length);
  let parentArr = projectExperienceArr[0].split("## ").filter(i => i.length);
  projectExperienceArr.splice(0, 1);

  // 教育经历
  let educationExperienceArr = parentArr[0].split("\r\n");
  let educationExperience = {
    title: educationExperienceArr[0],
    school: educationExperienceArr[1].replace(/school：/g, ""),
    professional: educationExperienceArr[2].replace(/professional:/g, ""),
    record: educationExperienceArr[3].replace(/record:/g, ""),
    time: educationExperienceArr[4].replace(/time:/g, "")
  };
  // 个人优势
  let personalAdvantageArr = parentArr[1].split("\r\n").filter(i => i.length);
  let personalAdvantage = {
    title: personalAdvantageArr[0],
    content: personalAdvantageArr[1]
  };
  // 工作经历
  let workExperienceArr = parentArr[2].split("\r\n").filter(i => i.length);
  let workExperience = {
    title: workExperienceArr[0],
    company: workExperienceArr[1].replace(/company: /g, ""),
    job: workExperienceArr[1].replace(/job: /g, ""),
    time: workExperienceArr[1].replace(/time: /g, ""),
    mainContent: workExperienceArr.splice(5)
  };
  // 主要项目

  return parentArr.concat(projectExperienceArr);
};
