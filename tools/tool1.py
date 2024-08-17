import os
import json
import re
import sys

def convert_nodes_to_target_format(data):
    nodes = data.get("nodes", [])
    edges = data.get("edges", [])

    # 创建一个节点ID到文本内容的映射
    node_map = {node["id"]: node for node in nodes}
    # 记录每个节点被指向的次数
    node_incoming_count = {node["id"]: 0 for node in nodes}

    # 统计每个节点被指向的次数
    for edge in edges:
        to_node_id = edge["toNode"]
        if to_node_id in node_incoming_count:
            node_incoming_count[to_node_id] += 1

    target_content = {}
    root_id = None

    for node in nodes:
        node_id = node["id"]
        text_lines = node["text"].split("\n\n")
        color = node.get("color", "")

        # 如果是带 color: "5" 的节点，则跳过，稍后处理为 options
        if color == "5":
            continue

        # 基础节点结构
        target_node = {
            "id": node_id,
            "text": text_lines,
            "options": []
        }

        # 查找与该节点相关的边
        outgoing_edges = [edge for edge in edges if edge["fromNode"] == node_id]

        for edge in outgoing_edges:
            to_node_id = edge["toNode"]
            to_node = node_map[to_node_id]
            to_node_text = to_node["text"].split("\n\n")[0]  # 使用目标节点的第一个文本作为选项

            if to_node.get("color", "") == "5":
                # 如果目标节点是带 color: "5" 的，处理为选项
                option_edges = [e for e in edges if e["fromNode"] == to_node_id]
                if option_edges:
                    option_next_id = option_edges[0]["toNode"]
                    target_node["options"].append({
                        "text": [to_node_text],
                        "nextId": option_next_id
                    })
            else:
                # 否则，直接设置 nextId
                target_node["nextId"] = to_node_id

        target_content[node_id] = target_node

        # 如果某个节点只有出度，没有入度，将其标记为root
        if node_incoming_count[node_id] == 0 and outgoing_edges:
            root_id = node_id

    # 重命名root节点
    if root_id:
        target_content['root'] = target_content.pop(root_id)
        target_content['root']['id'] = 'root'

    return target_content

def format_to_js_object(obj):
    """Format a Python dictionary to a JS-like object string with quoted top-level keys and unquoted nested keys."""
    json_str = json.dumps(obj, indent=4, ensure_ascii=False)
    
    # Use a regular expression to remove quotes from keys, but keep top-level keys intact
    def replace_key_quotes(match):
        key = match.group(1)
        if key.isidentifier():
            return f"{key}:"
        return f'"{key}":'
    
    js_object_str = re.sub(r'\"(\w+)\":', replace_key_quotes, json_str)

    # Split the string into lines, add commas to the end of each node definition
    lines = js_object_str.splitlines()
    for i in range(len(lines)):
        if lines[i].strip().endswith("}") and i < len(lines) - 1:
            lines[i] += ","

    return "\n".join(lines)[1:-1]  # Remove the outermost {}

def format_to_js_object_with_wrapper(obj):
    """Format a Python dictionary to a JS-like object string with additional fixed content."""
    js_object_str = format_to_js_object(obj)

    # Add fixed content at the beginning and end
    wrapper_start = "import { DialogueNode } from './types';\n\nconst dialogueAlice: Record<string, DialogueNode> = {\n"
    wrapper_end = "\n};\n\nexport default dialogueAlice;"

    return wrapper_start + js_object_str + wrapper_end

def process_files_in_directory(input_dir, output_dir):
    # 遍历输入目录中的所有 .canvas 文件
    for filename in os.listdir(input_dir):
        if filename.endswith('.canvas'):
            input_file = os.path.join(input_dir, filename)
            output_filename = os.path.splitext(filename)[0] + '.ts'
            output_file = os.path.join(output_dir, output_filename)

            # 读取原始 .canvas 文件内容
            with open(input_file, 'r', encoding='utf-8') as f:
                original_content = json.load(f)

            # 转换内容
            target_content = convert_nodes_to_target_format(original_content)

            # 格式化并写入目标 .ts 文件
            js_object_str_with_wrapper = format_to_js_object_with_wrapper(target_content)
            
            # 确保目标文件夹存在
            os.makedirs(os.path.dirname(output_file), exist_ok=True)

            # 写入目标文件
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(js_object_str_with_wrapper)

if __name__ == "__main__":
    # 获取从命令行传递的输入和输出路径
    input_dir = sys.argv[1]
    output_dir = sys.argv[2]

    # 处理目录中的所有 .canvas 文件
    process_files_in_directory(input_dir, output_dir)
