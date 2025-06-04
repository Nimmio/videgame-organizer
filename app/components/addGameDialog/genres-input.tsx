import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";

interface GenresInputProps {
  value: string[];
  onChange: (newValue: string[]) => void;
}

const GenresInput = ({ value, onChange }: GenresInputProps) => {
  const [inputValue, setInputValue] = useState<string>("");

  const handleAdd = () => {
    if (inputValue === "" || value.includes(inputValue)) return; // Do nothing if genre is already added

    const newValue = [...value, inputValue];
    onChange(newValue);
    setInputValue("");
  };

  const handleDelete = (genre: string) => {
    const newValue = [...value];
    newValue.splice(value.indexOf(genre), 1);
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          id="genres"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter a genre"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
        />
        <Button type="button" onClick={handleAdd} size="sm">
          Add
        </Button>
      </div>

      {value && value.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {value.map((genre) => (
            <Badge key={genre} variant="secondary" className="text-xs">
              {genre}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-1"
                onClick={() => handleDelete(genre)}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default GenresInput;
