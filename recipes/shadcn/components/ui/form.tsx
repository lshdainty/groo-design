import * as React from "react";
import { Controller, FormProvider, type ControllerProps, type FieldPath, type FieldValues } from "react-hook-form";

import { Field, type FieldProps } from "@/components/ui/field";

/*
 * Groo Form — react-hook-form 을 Field 에 잇는다(2026-10-01). 스펙은 specs/components/field.md(Field 가 폼을 맡는다).
 *
 *   Form       FormProvider 그대로
 *   FormField  Controller + Field — 칸의 오류(fieldState.error)를 Field 의 invalid · errorMessage 로 넘긴다
 *
 * 라벨 · 설명 · 필수 표시 · 글자 수는 Field 의 속성 그대로 준다. render 는 입력 하나를 돌려준다 — field 를 펼쳐 준다.
 *
 *   <FormField control={form.control} name="title" label="제목" render={({ field }) => <Input {...field} />} />
 *
 * 검증은 제출 때 칸마다(useForm 기본 mode: "onSubmit") — 저장 버튼은 켜 두고, 누르면 비거나 틀린 칸에 오류를 보이고
 * 첫 오류 칸으로 포커스를 옮긴다(shouldFocusError 기본). 잘못 넣으면 위험한 칸(보안 · 금융)만 칸을 떠날 때 바로
 * 검증한다 — 그 칸에 rules 를 주고 onBlur 에서 trigger(name). field.md 의 "제출과 검증".
 */

const Form = FormProvider;

export type FormFieldProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> = ControllerProps<
  TFieldValues,
  TName
> &
  Omit<FieldProps, "children" | "invalid" | "errorMessage" | "disabled">;

function FormField<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({
  name,
  control,
  rules,
  defaultValue,
  shouldUnregister,
  disabled,
  render,
  ...fieldProps
}: FormFieldProps<TFieldValues, TName>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue={defaultValue}
      shouldUnregister={shouldUnregister}
      disabled={disabled}
      render={(args) => (
        <Field {...fieldProps} disabled={disabled} invalid={!!args.fieldState.error} errorMessage={args.fieldState.error?.message}>
          {render(args)}
        </Field>
      )}
    />
  );
}

export { Form, FormField };
