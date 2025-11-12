import React from "react";
import type { ModalProps } from "@mantine/core";
import {
  Modal,
  Stack,
  Text,
  Button,
  Group,
  TextInput,
  ColorInput,
} from "@mantine/core";
import type { NodeData, NodeRow } from "../../../types/graph";
import useGraph from "../../editor/views/GraphView/stores/useGraph";

export const EditNodeModal = ({ opened, onClose }: ModalProps) => {
  const nodeData = useGraph(state => state.selectedNode);
  const updateNodeValue = useGraph(state => state.updateNodeValue);

  // Find "name" and "color" fields in the node
  const editableFields = React.useMemo(() => {
    if (!nodeData?.text) return { name: null as NodeRow | null, color: null as NodeRow | null };
    
    let nameRow: NodeRow | null = null;
    let colorRow: NodeRow | null = null;
    
    for (const row of nodeData.text) {
      if (row.key === "name" && row.type !== "object" && row.type !== "array") {
        nameRow = row;
      }
      if (row.key === "color" && row.type !== "object" && row.type !== "array") {
        colorRow = row;
      }
    }
    
    return { name: nameRow, color: colorRow };
  }, [nodeData]);

  const [nameValue, setNameValue] = React.useState("");
  const [colorValue, setColorValue] = React.useState("");

  React.useEffect(() => {
    if (editableFields.name) {
      setNameValue(String(editableFields.name.value || ""));
    }
    if (editableFields.color) {
      setColorValue(String(editableFields.color.value || ""));
    }
  }, [editableFields]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nodeData?.path) return;

    // Update name if it exists and has changed
    if (editableFields.name && nameValue !== String(editableFields.name.value)) {
      const namePath = [...nodeData.path, "name"];
      updateNodeValue(namePath, nameValue);
    }

    // Update color if it exists and has changed
    if (editableFields.color && colorValue !== String(editableFields.color.value)) {
      const colorPath = [...nodeData.path, "color"];
      updateNodeValue(colorPath, colorValue);
    }

    onClose();
  };

  // Check if there are any editable fields
  const hasEditableFields = editableFields.name || editableFields.color;

  if (!hasEditableFields) {
    return (
      <Modal size="md" opened={opened} onClose={onClose} title="Edit Node" centered>
        <Text c="dimmed" size="sm">
          This node does not contain "name" or "color" fields that can be edited.
        </Text>
        <Group justify="flex-end" mt="md">
          <Button onClick={onClose}>Close</Button>
        </Group>
      </Modal>
    );
  }

  return (
    <Modal size="md" opened={opened} onClose={onClose} title="Edit Node" centered>
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          {editableFields.name && (
            <TextInput
              label="Name"
              placeholder="Enter name"
              value={nameValue}
              onChange={(e) => setNameValue(e.currentTarget.value)}
              required
            />
          )}
          
          {editableFields.color && (
            <ColorInput
              label="Color"
              placeholder="Pick or enter color"
              value={colorValue}
              onChange={setColorValue}
              format="hex"
              swatches={[
                '#FF0000', '#FFFF00', '#FFA500', '#00FF00', '#0000FF', 
                '#800080', '#FFC0CB', '#A52A2A', '#808080', '#000000'
              ]}
            />
          )}

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};
