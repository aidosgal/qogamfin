import React, { useState } from "react";
import { UserCard } from "../entities/user/ui/UserCard";
import { User } from "../entities/user/model/types/user";

export const ProfileScreen: React.FC = () => {
  const [user] = useState<User>({
    id: 1,
    first_name: "Айдос",
    "last_name": "Галимжан",
    "email": "test",
  })
  return (
      <UserCard profile={user} />
  )
}
