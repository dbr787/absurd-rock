import RadiusCalculator from "../components/RadiusCalculator";
import { RectangleRadiusForm } from "../components/RectangleRadiusForm";

import {
  FontBoldIcon,
  FontItalicIcon,
  UnderlineIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import { PanelLeftClose } from "lucide-react";

export default function Home() {
  return (
    <div className="p-2 flex space-x-2 space-y-8">
      {/* <div className="w-80">
        <RadiusCalculator />
      </div> */}
      <div className="w-80">
        <RectangleRadiusForm />
      </div>

      {/* <div className="flex space-x-2">
        <Button variant="default" size="sm">
          Button
        </Button>
        <Button variant="default" size="default">
          Button
        </Button>
        <Button variant="outline" size="sm">
          Button
        </Button>
        <Button variant="outline" size="default">
          Button
        </Button>
      </div> */}

      {/* <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2">
          <Switch id="airplane-mode" />
          <Label htmlFor="airplane-mode">Page Sidebar</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="airplane-mode" />
          <Label htmlFor="airplane-mode">Airplane Mode</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="airplane-mode" />
          <Label htmlFor="airplane-mode">Airplane Mode</Label>
        </div>
      </div> */}

      {/* <ToggleGroup type="multiple" variant="outline">
        <ToggleGroupItem value="bold" aria-label="Toggle bold">
          <FontBoldIcon className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Toggle italic">
          <FontItalicIcon className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem
          className="px-2"
          size="default"
          value="strikethrough"
          aria-label="Toggle strikethrough"
        >
          <UnderlineIcon className="h-4 w-4" />
          <PanelLeftClose color="black" size={20} />
        </ToggleGroupItem>
      </ToggleGroup> */}
    </div>
  );
}
