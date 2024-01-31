import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { UserSession } from "@repo/domain";
import { AxiosError } from "axios";
import { useAuth } from "../../context/auth.context.tsx";
import { Input } from "../../components/input/input.tsx";
import { Button } from "../../components/button/button.tsx";
import { getApi } from "../../utils/api.ts";
import styles from "./register.module.css";

interface RegisterData {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
}

export function Register() {
  const { setUserSession } = useAuth();
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    trigger,
    formState: { errors },
    watch,
  } = useForm<RegisterData>({});

  const [formError, setFormError] = useState<string>();
  const api = getApi();
  const onSubmit: SubmitHandler<RegisterData> = (data) => {
    api
      .post<UserSession>("/auth/register", data)
      .then((res) => {
        setUserSession(res.data);
        navigate("/characters");
      })
      .catch((error: AxiosError<{ message: string }>) => {
        setFormError(error.response?.data.message);
      });
  };
  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1 className={styles.header}>The Rick and Morty App</h1>
          {formError ? <h4 className={styles.error}>{formError}</h4> : null}
          <div className={styles.inputs}>
            <Input
              error={errors.name?.message}
              label="Name"
              placeholder="Rick Sanchez"
              {...register("name", {
                required: "Name is required!",
              })}
            />
            <Input
              error={errors.email?.message}
              label="Email"
              placeholder="ricksanchez@wabalabadubdub.com"
              {...register("email", {
                required: "Email is Required!",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
            <Input
              error={errors.password?.message}
              label="Password"
              placeholder="*********"
              type="password"
              {...register("password", {
                required: "You must specify a password",
                pattern: {
                  value:
                    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/,
                  message:
                    "Password must be at least 8 characters and one number,one special character, one lowercase letter and one uppercase letter",
                },
                minLength: {
                  value: 8,
                  message: "Password must be more than 8 characters",
                },
              })}
            />
            <Input
              error={errors.confirmPassword?.message}
              label="Confirm password"
              placeholder="*********"
              type="password"
              {...register("confirmPassword", {
                validate: (value) =>
                  value === watch("password", "") ||
                  "The passwords do not match",
              })}
              autoComplete="off"
              onKeyUp={() => {
                trigger("confirmPassword");
              }}
              onPaste={(e) => {
                e.preventDefault();
                return false;
              }}
            />
            <p className={styles.hint}>
              Password should contain at least one number, one special
              character, one lowercase letter and one uppercase letter
            </p>
            <Button type="submit">Sign up</Button>
          </div>
        </form>
        <Link className={styles.link} to="/login">
          Log in
        </Link>
      </div>
    </div>
  );
}
