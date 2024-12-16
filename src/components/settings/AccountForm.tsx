import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Separator } from "@radix-ui/react-separator";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
// import { useRef } from "react";

export default function AccountForm() {
  //   const imageRef = useRef();
  // const {user} = useAuth()
  const name = "James";
  const [image, setImage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Convert the file to a data URL for preview
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader?.result as string); // Update state with the data URL
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null); // Reset the image state
  };

  return (
    <Card className="p-4">
      <p className="font-bold mb-4">Account Details</p>
      <Separator />

      <p className="mb-4">Profile Photo</p>

      <div className="flex gap-4 items-center">
        <div className="flex items-center bg-neutral-300 justify-center h-8 w-8 rounded-full">
          <Avatar>
            {!image ? (
              <AvatarFallback>
                {name.charAt(0).toUpperCase() +
                  name.charAt(name.length - 1).toUpperCase()}
              </AvatarFallback>
            ) : (
              <AvatarImage src={image} alt="avatar" />
            )}
          </Avatar>
        </div>
        <div>
          <label htmlFor="file-upload" className="cursor-pointer">
            <span className="font-bold text-sm">Upload New Photo</span>
          </label>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
          />
          <p className="text-neutral-400 text-sm mt-2">
            PNG, JPG, max size of 5MB
          </p>
          {image && (
            <Button
              variant="link"
              className="text-destructive text-[12px] p-0 mt-2"
              onClick={handleRemoveImage}
            >
              Remove
            </Button>
          )}
        </div>
      </div>

      <form>
        <div className="grid w-full">
          <div className="grid-cols-2 max-w-sm items-center gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input type="text" id="name" placeholder="John Doe" />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" placeholder="johndoe@gmail.com" />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="reg_no">Registration Number</Label>
            <Input
              type="text"
              id="reg_no"
              placeholder="20211049855"
              inputMode="numeric"
            />
          </div>
        </div>
      </form>
    </Card>
  );
}
