import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { UserSession } from "@repo/domain";
import { AxiosError } from "axios";
import { useAuth } from "../../context/auth.context.tsx";
import { Input } from "../../components/input/input.tsx";
import { Button } from "../../components/button/button.tsx";
import { getApi } from "../../utils/api.ts";
import styles from "./login.module.css";

interface LoginData {
  email: string;
  password: string;
}

export function Login() {
  const { setUserSession } = useAuth();
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginData>({});

  const [formError, setFormError] = useState<string>();
  const api = getApi();
  const onSubmit: SubmitHandler<LoginData> = (data) => {
    api
      .post<UserSession>("/auth/login", data)
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
                    "Password should contain at least one number,one special character, one lowercase letter and one uppercase letter",
                },
                minLength: {
                  value: 8,
                  message: "Password must be more than 8 characters",
                },
              })}
            />
            <Button type="submit">Log in</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
