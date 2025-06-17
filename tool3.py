import json
import os

def process_canvas_file(file_path, y_increment=100):
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    nodes = data.get("nodes", [])
    edges = data.get("edges", [])

    # 找到所有被指向的节点ID
    pointed_nodes = set(edge['toNode'] for edge in edges)
    
    # 找到唯一一个没有被指向的节点
    non_pointed_node = None
    for node in nodes:
        if node['id'] not in pointed_nodes:
            if non_pointed_node is not None:
                raise ValueError(f"文件 {file_path} 中存在多个未被指向的节点")
            non_pointed_node = node

    if non_pointed_node:
        non_pointed_node['x'] = 0
        non_pointed_node['y'] = 0
        print(f"节点 {non_pointed_node['id']} 在文件 {file_path} 中的坐标已设置为 (0, 0)")
        # 递归地更新其子节点的坐标
        update_child_nodes(non_pointed_node['id'], nodes, edges, y_increment, current_y=0)
    else:
        raise ValueError(f"文件 {file_path} 中未找到唯一的未被指向的节点")

    # 将修改后的数据写回文件
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

def update_child_nodes(node_id, nodes, edges, y_increment, current_y):
    child_nodes = [edge['toNode'] for edge in edges if edge['fromNode'] == node_id]
    parent_node = next((node for node in nodes if node['id'] == node_id), None)

    for child_node_id in child_nodes:
        for node in nodes:
            if node['id'] == child_node_id:
                if parent_node:
                    node['y'] = current_y + parent_node['height'] + y_increment
                else:
                    node['y'] = current_y + y_increment
                print(f"节点 {node['id']} 的y坐标已设置为 {node['y']}")
                update_child_nodes(child_node_id, nodes, edges, y_increment, node['y'])

def process_all_canvas_files(directory, y_increment=100):
    for filename in os.listdir(directory):
        if filename.endswith('.canvas'):
            file_path = os.path.join(directory, filename)
            try:
                process_canvas_file(file_path, y_increment)
            except ValueError as e:
                print(f"错误: {e}")

if __name__ == "__main__":
    directory = "original_content"
    process_all_canvas_files(directory)
