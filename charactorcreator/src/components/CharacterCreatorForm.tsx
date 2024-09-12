"use client";
import { log } from "console";
import { useState } from "react";

interface SignUpFormState {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export default function CreateCharacterForm() {
  const [formData, setFormData] = useState<SignUpFormState>({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e.target);

    //   try {
    //     const response = await axios.post();
    //     console.log(response);
    //   } catch (error) {
    //     console.log(error);
    //   }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="firstname">First Name:</label>
        <br />
        <input
          type="text"
          name="firstname"
          id="fname"
          onChange={handleChange}
          value={formData.firstname}
          required
          maxLength={20}
        />
        <br />
      </div>

      <div>
        <label htmlFor="lastname">Last Name:</label>
        <br />
        <input
          type="text"
          name="lastname"
          id="lname"
          onChange={handleChange}
          value={formData.lastname}
          required
          maxLength={20}
        />
        <br />
      </div>

      <div>
        <label htmlFor="email">Email:</label>
        <br />
        <input
          type="email"
          name="email"
          id="email"
          onChange={handleChange}
          value={formData.email}
          required
          maxLength={40}
        />
        <br />
      </div>

      <div>
        <label htmlFor="password">Password:</label>
        <br />
        <input
          type="password"
          name="password"
          id="pass"
          onChange={handleChange}
          value={formData.password}
          required
          maxLength={15}
        />
        <br />
      </div>

      <button>Sign Up</button>
    </form>
  );
}
