---
title: 修改Butterfly主题的一些源码，定制样式
date: 2023-04-18 17:06:42
tags:
    - hexo
categories: 进阶
---
修改了一些butterfly主题的源码
# 1.修改posts页面不显示文章的分类的问题
发现posts文章页面顶部不显示文章的标签（tags），故阅读了修改了butterfly的相关源码，还提了一个pr给作者，经沟通作者说他有写tags，但是按照设计稿，tags在页面的底部展示。闹了个乌龙。不过我把这个修改放到我的项目里了，个人认为tags放顶部合适。
修改的文件目录为 themes/butterfly/layout/includes/header/post-info.pug
```Pug
- let comments = theme.comments
#post-info
  h1.post-title= page.title || _p('no_title')
    if theme.post_edit.enable
      a.post-edit-link(href=theme.post_edit.url + page.source title=_p('post.edit') target="_blank")
        i.fas.fa-pencil-alt
        
  #post-meta
    .meta-firstline
      if (theme.post_meta.post.date_type)
        span.post-meta-date
          if (theme.post_meta.post.date_type === 'both')
            i.far.fa-calendar-alt.fa-fw.post-meta-icon
            span.post-meta-label= _p('post.created')
            time.post-meta-date-created(datetime=date_xml(page.date) title=_p('post.created') + ' ' + full_date(page.date))=date(page.date, config.date_format)
            span.post-meta-separator |
            i.fas.fa-history.fa-fw.post-meta-icon
            span.post-meta-label= _p('post.updated')
            time.post-meta-date-updated(datetime=date_xml(page.updated) title=_p('post.updated') + ' ' + full_date(page.updated))=date(page.updated, config.date_format)
          else
            - let data_type_update = theme.post_meta.post.date_type === 'updated'
            - let date_type = data_type_update ? 'updated' : 'date'
            - let date_icon = data_type_update ? 'fas fa-history' :'far fa-calendar-alt'
            - let date_title = data_type_update ? _p('post.updated') : _p('post.created')
            i.fa-fw.post-meta-icon(class=date_icon)
            span.post-meta-label= date_title
            time(datetime=date_xml(page[date_type]) title=date_title + ' ' + full_date(page[date_type]))=date(page[date_type], config.date_format)
      
    //- 该处为我的修改，把分类和标签放在第二行。
    .meta-line2
      if (theme.post_meta.post.categories && page.categories.data.length > 0)
        span.post-meta-categories

          each item, index in page.categories.data
            i.fas.fa-inbox.fa-fw.post-meta-icon
            a(href=url_for(item.path)).post-meta-categories #[=item.name]
            if (index < page.categories.data.length - 1)
              i.fas.fa-angle-right.post-meta-separator
      //- 这一段是加的展示标签的代码
      if (theme.post_meta.page.tags && page.tags.data.length > 0)
          span.post-meta-tags
              span.post-meta-separator |
              i.fas.fa-tag
              each item, index in page.tags.data
                a(href=url_for(item.path)).post-meta__tags #[=' '+item.name+' ']
                if (index < page.tags.data.length - 1)
                  span.post-meta-link #[='•']

    .meta-secondline
      - let postWordcount = theme.wordcount.enable && (theme.wordcount.post_wordcount || theme.wordcount.min2read)
      if (postWordcount)
        span
        span.post-meta-wordcount
          if theme.wordcount.post_wordcount
            i.far.fa-file-word.fa-fw.post-meta-icon
            span.post-meta-label= _p('post.wordcount') + ':'
            span.word-count= wordcount(page.content)
            if theme.wordcount.min2read
              span.post-meta-separator |
          if theme.wordcount.min2read
            i.far.fa-clock.fa-fw.post-meta-icon
            span.post-meta-label= _p('post.min2read') + ':'
            span= min2read(page.content, {cn: 350, en: 160}) + _p('post.min2read_unit')
    
      //- for pv and count
      mixin pvBlock(parent_id,parent_class,parent_title)
        span.post-meta-separator |
        span(class=parent_class id=parent_id data-flag-title=page.title)
          i.far.fa-eye.fa-fw.post-meta-icon
          span.post-meta-label=_p('post.page_pv') + ':'
          if block
            block

      - const commentUse = comments.use
      if page.comments !== false && commentUse && !comments.lazyload
        if commentUse[0] === 'Valine' && theme.valine.visitor
          +pvBlock(url_for(page.path),'leancloud_visitors',page.title)
            span.leancloud-visitors-count
              i.fa-solid.fa-spinner.fa-spin
        else if commentUse[0] === 'Waline' && theme.waline.pageview
          +pvBlock('','','')
            span.waline-pageview-count(data-path=url_for(page.path))
              i.fa-solid.fa-spinner.fa-spin
        else if commentUse[0] === 'Twikoo' && theme.twikoo.visitor
          +pvBlock('','','')
            span#twikoo_visitors
              i.fa-solid.fa-spinner.fa-spin
        else if commentUse[0] === 'Artalk' && theme.artalk.visitor
          +pvBlock('','','')
            span#ArtalkPV
              i.fa-solid.fa-spinner.fa-spin
        else if theme.busuanzi.page_pv
          +pvBlock('','post-meta-pv-cv','')
            span#busuanzi_value_page_pv
              i.fa-solid.fa-spinner.fa-spin
      else if theme.busuanzi.page_pv
        +pvBlock('','post-meta-pv-cv','')
          span#busuanzi_value_page_pv
            i.fa-solid.fa-spinner.fa-spin

      if comments.count && !comments.lazyload && page.comments !== false && comments.use
        - var whichCount = comments.use[0]

        mixin countBlock
          span.post-meta-separator |
          span.post-meta-commentcount
            i.far.fa-comments.fa-fw.post-meta-icon
            span.post-meta-label= _p('post.comments') + ':'
            if block
              block
        
        case whichCount
          when 'Disqus'
            +countBlock
              span.disqus-comment-count
                a(href=full_url_for(page.path) + '#disqus_thread')
                  i.fa-solid.fa-spinner.fa-spin
          when 'Disqusjs'
            +countBlock
              a(href=full_url_for(page.path) + '#disqusjs')
                span.disqus-comment-count(data-disqus-url=full_url_for(page.path))
                  i.fa-solid.fa-spinner.fa-spin
          when 'Valine'
            +countBlock
              a(href=url_for(page.path) + '#post-comment' itemprop="discussionUrl")
                span.valine-comment-count(data-xid=url_for(page.path) itemprop="commentCount")
                  i.fa-solid.fa-spinner.fa-spin
          when 'Waline'
            +countBlock
              a(href=url_for(page.path) + '#post-comment')
                span.waline-comment-count(data-path=url_for(page.path))
                  i.fa-solid.fa-spinner.fa-spin
          when 'Gitalk'
            +countBlock
              a(href=url_for(page.path) + '#post-comment')
                span.gitalk-comment-count
                  i.fa-solid.fa-spinner.fa-spin
          when 'Twikoo'
            +countBlock
              a(href=url_for(page.path) + '#post-comment')
                span#twikoo-count
                  i.fa-solid.fa-spinner.fa-spin
          when 'Facebook Comments'
            +countBlock
              a(href=url_for(page.path) + '#post-comment')
                span.fb-comments-count(data-href=urlNoIndex())
          when 'Remark42'
            +countBlock
              a(href=url_for(page.path) + '#post-comment')
                span.remark42__counter(data-url=urlNoIndex())
                  i.fa-solid.fa-spinner.fa-spin
          when 'Artalk'
            +countBlock
              a(href=url_for(page.path) + '#post-comment')
                span.artalk-count
                  i.fa-solid.fa-spinner.fa-spin
```

# 2.修改顶部导航，左上角导航链接
右侧的导航都是在配置文件中配置的，左上角的导航，默认回到`/`，是在主题源码里写的。
因为我的博客是挂在我的三级域名blog.liangyonggang.com下的，我想点击左上角的时候回到我的二级域名。故需要修改主题源码。
源码路径是 themes/butterfly/layout/includes/header/nav.pug
```Pug
nav#nav
  span#blog-info
    a(href=url_for('https://liangyonggang.com') title=config.title)
    ...
```

# 3.修改了首页每篇文章的卡片的高度，使其紧凑
全局搜索了recent-post-item样式名，找到homepage.styl文件，找到recent-post-item中高度height: 18em改为height: 12em
