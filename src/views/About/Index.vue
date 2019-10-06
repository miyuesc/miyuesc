<template>
  <div class="about">
    <loading v-if="doLoading"> </loading>
    <div class="main" v-else>
      <div class="cover">
        <span>ABOUT ME</span>
      </div>
      <div class="about-main-content">
        <div class="about-item education-experience">
          <div>学校：{{ educationExperience.school }}</div>
          <div>专业：{{ educationExperience.professional }}</div>
          <div>时间：{{ educationExperience.time }}</div>
          <div>学历：{{ educationExperience.record }}</div>
        </div>
        <div class="about-item personal-advantage">
          <div>技术栈：{{ personalAdvantage.content[0].text }}</div>
        </div>
        <div class="about-item work-experience">
          <div v-for="(i, k) in workExperience" :key="k">
            <div>{{ i.company }}</div>
            <div>时间：{{ i.time }}</div>
            <div>职位：{{ i.job }}</div>
            <div class="work-main-content">
              工作内容：
              <ul>
                <li v-for="(j, jk) in i.mainContent" :key="j.label">
                  {{ `${jk + 1} : ${j.text}` }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="about-item project-experience">
          <div class="project-item" v-for="(i, k) in projectExperience" :key="k">
            <div class="project-item-name">{{ i.projectName }}</div>
            <div>时间：{{ i.time }}</div>
            <div>角色：{{ i.role }}</div>
            <div class="project-desc" v-if="i.projectDesc">
              项目内容：
              <ul>
                <li v-for="(n, nk) in i.projectDesc" :key="n.label">
                  {{ `${nk + 1} : ${n.text}` }}
                </li>
              </ul>
            </div>
            <div class="project-responsibility" v-if="i.responsibility.length">
              主要工作：
              <ul>
                <li v-for="m in i.responsibility" :key="m.label">
                  {{ `${m.label} : ${m.text}` }}
                </li>
              </ul>
            </div>
            <div>技术栈：{{ i.technology }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Model, Watch } from "vue-property-decorator";
import about from "@/config/about";
import { education, personal, project, work } from "@/utils/interface";

@Component({})
export default class About extends Vue {
  loaded: boolean = true;
  doLoading: boolean = true;
  educationExperience: education = about.educationExperience;
  personalAdvantage: personal = about.personalAdvantage;
  workExperience: work[] = about.workExperience;
  projectExperience: project[] = about.projectExperience;

  created() {
    setTimeout(() => (this.doLoading = false), 300);
  }
}
</script>

<style scoped lang="less">
@import "./about.less";
</style>
