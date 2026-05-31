import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'

export default defineUserConfig({
  lang: 'zh-CN',
  title: '项目开发计划',
  description: '开发计划与技术文档',

  theme: defaultTheme({
    logo: null,
    navbar: [
      { text: '首页', link: '/' },
      { text: '需求分析', link: '/01-需求分析/' },
      { text: '技术调研', link: '/02-技术调研/' },
      { text: '模板中心', link: '/03-模板中心/' },
      { text: '开发计划', link: '/04-开发计划/' },
      { text: '开发规范', link: '/05-开发规范/' },
      { text: '项目跟踪', link: '/06-项目跟踪/' },
    ],
    sidebar: {
      '/01-需求分析/': [
        {
          text: '需求分析',
          children: ['/01-需求分析/README.md'],
        },
      ],
      '/02-技术调研/': [
        {
          text: '技术调研',
          children: ['/02-技术调研/README.md'],
        },
      ],
      '/03-模板中心/': [
        {
          text: '模板中心',
          children: [
            '/03-模板中心/README.md',
            '/03-模板中心/前端开发模板.md',
            '/03-模板中心/后端开发模板.md',
          ],
        },
      ],
      '/04-开发计划/': [
        {
          text: '开发计划',
          children: [
            '/04-开发计划/README.md',
            '/04-开发计划/整体架构.md',
            '/04-开发计划/模块拆分.md',
            '/04-开发计划/迭代计划.md',
          ],
        },
      ],
      '/05-开发规范/': [
        {
          text: '开发规范',
          children: ['/05-开发规范/README.md'],
        },
      ],
      '/06-项目跟踪/': [
        {
          text: '项目跟踪',
          children: ['/06-项目跟踪/README.md'],
        },
      ],
    },
    repo: null,
    docsDir: 'docs',
    editLink: false,
    lastUpdated: true,
    contributors: false,
  }),
})
