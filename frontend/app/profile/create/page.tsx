"use client";

import React, { Suspense } from "react";
import ProfileCreation from "./ProfileCreation";

export default function ProfileCreationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileCreation />
    </Suspense>
  );
}
