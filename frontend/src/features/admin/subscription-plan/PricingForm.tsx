import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Switch } from "@/components/atoms/switch";
import { DialogFooter } from "@/components/organisms/dialog";
import { ScrollArea } from "@/components/organisms/scroll-area";
import { Plus, X } from "lucide-react";
import { useState } from "react";

export const PlanForm = ({ plan, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    plan || {
      id: Date.now(),
      name: "",
      price: "",
      interval: "/month",
      features: [""],
      buttonText: "Upgrade Plan",
      featured: false,
      badge: "PRO",
    },
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ""] });
  };

  const removeFeature = (index) => {
    const newFeatures = [...formData.features];
    newFeatures.splice(index, 1);
    setFormData({ ...formData, features: newFeatures });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Plan Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Growth Plan"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="79.00"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="interval">Billing Interval</Label>
          <Input
            id="interval"
            name="interval"
            value={formData.interval}
            onChange={handleChange}
            placeholder="/month"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="buttonText">Button Text</Label>
          <Input
            id="buttonText"
            name="buttonText"
            value={formData.buttonText}
            onChange={handleChange}
            placeholder="Upgrade Plan"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="featured"
          checked={formData.featured}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, featured: checked })
          }
        />
        <Label htmlFor="featured">Featured Plan</Label>
      </div>

      {formData.featured && (
        <div className="space-y-2">
          <Label htmlFor="badge">Badge Text</Label>
          <Input
            id="badge"
            name="badge"
            value={formData.badge}
            onChange={handleChange}
            placeholder="PRO"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label>Features</Label>
        <ScrollArea className="h-60 rounded-md border">
          <div className="p-4 space-y-2">
            {formData.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  placeholder="Feature description"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeFeature(index)}
                  disabled={formData.features.length <= 1}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
        <Button
          variant="outline"
          size="sm"
          onClick={addFeature}
          className="mt-2"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Feature
        </Button>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={() => onSave(formData)}>Save Plan</Button>
      </DialogFooter>
    </div>
  );
};
