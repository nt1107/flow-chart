**传入的数据，应该有 font-size(style 字段中)，否则会默认为 8**

**主线**

- 所有的节点应该有至少一条主线，主线在画板里面应该是从上而下绘制的，其余的节点应该依托着主线绘制，布局
- 主线的节点应该有一个共同的父节点，这个节点的 type 为**_container_**
- 一段节点的集合里面，可以有多个主线，也就是说，type 为**_container_**的节点可以作为子节点

**预处理**
先遍历一下所有的节点，存下所有重复的节点

**数据处理**

对于**_重复节点_**：
如果节点满足重复节点的条件，那么，重复节点的最后一个父节点，会被标记上

> hasRepeatNode： true

目前满足重复节点的条件是：

- 重复节点的父元素的所有兄弟元素都以这个重复节点作为子元素
- 重复节点的父元素的所有兄弟元素都只有一个子元素

经过处理的属性有：

**data**

- id
- parent
- type(自定义)

**position**

- x,y

**style**

- width, height
- label
- font-size

**hook 中做后处理**
可以向*beforeRender*方法中传入一个函数，函数的第一个参数是即将拿到的 node list,可以通过这个函数对 list 做一些最终的改变

需要经过后续处理的属性有：

- classes（可以根据 data 中的 type 添加）
- style 中的其他属性

# cytoscape

**elements 格式**

```javascript
{
          data: {
            id: 'bb',
            parent: 'a'
          },
          position: {
            x: 450,
            y: 50
          },
          classes: 'class1',
          style: {
            shape: 'ellipse',
            width: 100,
            height: 40,
            label: '犯罪嫌疑人'
          }
        },
        {
          data: {
            source: 'c',
            target: 'cc',
            parent: 'a'
          },
          classes: 'classLine',
          style: {
            label: '时间'
          }
        }
```

**style layout**

```javascript
,
      style: [
        {
          selector: '.classLine',
          style: {
            'font-size': 8,
            width: 1,
            'line-color': '#000',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle',
            'text-halign': 'left',
            'text-valign': 'left'
          }
        }
      ],
      layout: {
        name: 'preset'
      }
```

**定义类**

```javascript
cy.style().selector('.class1').css({
  'background-color': 'white',
  'border-width': 1,
  'border-color': '#000',
  'font-size': 8,
  color: 'black',
  'text-halign': 'center',
  'text-valign': 'center',
  'text-wrap': 'wrap'
})
```
