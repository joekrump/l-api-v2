import {Block, Attribute} from "prosemirror/dist/model"
import {elt,insertCSS} from "prosemirror/dist/util/dom"
import {defParser, defParamsClick, selectedNodeAttr} from "../../utils"
import {insertWidget} from "./index"

const css = "widgets-spreadsheet"
	
export class SpreadSheet extends Block {
	serializeDOM(node,s){
		if (node.rendered) {
			node.rendered = node.rendered.cloneNode(true)
		} else {
			node.rendered = elt("div", { class: css+" widgets-edit"});
			// wait until node is attached to document to render
			window.setTimeout(function() {
				let data = [
		            ["", "Ford", "Volvo", "Toyota", "Honda"],
		            ["2014", 10, 11, 12, 13],
		            ["2015", 20, 11, 14, 13],
		            ["2016", 30, 15, 12, 13]
		        ];
		
		        new Handsontable(node.rendered, {
		        	data: data,
		            minSpareRows: 1,
		            rowHeaders: true,
		            colHeaders: true,
		            contextMenu: true
		        });
			}, 100)
		}
		return node.rendered
	}
	get attrs() {
		return {
			data: new Attribute
		}
	}
}

defParser(SpreadSheet,"div",css)

SpreadSheet.register("command", "insert", {
	label: "SpreadSheet",
	run(pm, data) {
		let {from,to,node} = pm.selection
		if (node && node.type == this) {
			let tr = pm.tr.setNodeType(from, this, {data}).apply()
			return tr
		} else
			return insertWidget(pm,from,this.create({data}))
	},
	select(pm) {
  		return true
	},
	menu: {group: "content", rank: 75, select: "disable", display: {type: "label", label: "Spreadsheet"}},
    params: [
      	{ name: "Data Link", attr: "data", label: "Link to CSV (fixed for demo)", type: "file", default: "cars.csv", 
   	      prefill: function(pm) { return selectedNodeAttr(pm, this, "data") }}
 	]
})

defParamsClick(SpreadSheet,"spreadsheet:insert",["all"])

insertCSS(`

.ProseMirror .${css} {
	display: inline-block;
}

`)