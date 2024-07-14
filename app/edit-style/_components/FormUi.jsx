import { Input } from "@/components/ui/input";
import React, { useRef, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import moment from "moment/moment";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FieldEdit from "./FieldEdit";
import { db } from "@/configs";
import { userResponses } from "@/configs/schema";
import { SignInButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

function FormUi({
  jsonForm,
  selectedTheme,
  onFieldUpdate,
  deleteField,
  editable = true,
  formId = 0,
  enabledSignIn = false,
}) {
  const [formData, setFormData] = useState({});

  let formReference = useRef();

  const { user, isSignedIn } = useUser();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRadioChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onFormSubmit = async (event) => {
    event.preventDefault();
    console.log(formData);

    const result = await db.insert(userResponses).values({
      jsonResponse: formData,
      createdAt: moment().format("DD/MM/yyy"),
      formReference: formId,
    });

    if (result) {
      formReference.reset();
      toast("Response submitted successfully !!!");
    } else toast("Error while saving your form !!!");
  };

  return (
    <form
      ref={(e) => (formReference = e)}
      onSubmit={onFormSubmit}
      className="border p-3 md:w-[600px] rounded-lg"
      data-theme={selectedTheme}
    >
      <h2 className="font-bold text-center text-2xl">{jsonForm?.formTitle}</h2>
      <h2 className="text-sm text-center">{jsonForm?.formSubheading}</h2>

      {jsonForm?.formFields?.map((field, index) => (
        <div key={index} className="my-2 flex items-center">
          {field.fieldType === "select" ? (
            <div className="my-1 w-full">
              <label className="text-xs">{field.formLabel}</label>
              <Select
                name={field.fieldName}
                onValueChange={(v) => handleSelectChange(field.fieldName, v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={field.placeholderName} />
                </SelectTrigger>
                <SelectContent>
                  {field.options.map((item, idx) => (
                    <SelectItem key={idx} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : field.fieldType === "checkbox" ? (
            <div className="flex items-center my-1 w-full">
              <label className="text-xs mr-2">{field.formLabel}</label>
              <Checkbox name={field.fieldName} required={field?.required} />
            </div>
          ) : field.fieldType === "bullet" ? (
            <div className="my-1 w-full">
              <label className="text-xs">{field.formLabel}</label>
              <ul className="list-disc ml-4">
                {field.options.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          ) : field.fieldType === "radio" ? (
            <div className="my-1 w-full">
              <label className="text-xs">{field.formLabel}</label>
              <RadioGroup>
                {field.options.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={field.fieldName}
                      id={item.formLabel}
                    />
                    <Label htmlFor="option-two">Option Two</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ) : (
            <div className="my-1 w-full">
              <label className="text-xs">{field.formLabel}</label>
              <Input
                type={field?.type}
                placeholder={field.placeholderName}
                name={field.fieldName}
                required={field?.required}
                onChange={handleInputChange}
              />
            </div>
          )}

          {editable && (
            <div className="ml-2">
              <FieldEdit
                defaultValue={field}
                onUpdate={(value) => onFieldUpdate(value, index)}
                deleteField={() => deleteField(index)}
              />
            </div>
          )}
        </div>
      ))}
      {!enabledSignIn ? (
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      ) : isSignedIn ? (
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      ) : (
        <Button>
          <SignInButton mode="modal">
            Sign In before submitting !!!
          </SignInButton>
        </Button>
      )}
    </form>
  );
}

export default FormUi;
