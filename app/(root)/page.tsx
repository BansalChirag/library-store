import BookList from "@/components/BookList";
import BookOverview from "@/components/BookOverview";
import { sampleBooks } from "@/constants";
import { db } from "@/database";
import { usersTable } from "@/database/schema";
import React from "react";

const Home = async () => {
  const users = await db.select().from(usersTable);

  return (
    <>
      <BookOverview {...sampleBooks[0]} />
      <BookList
        title="Latest Books"
        books={sampleBooks.slice(1)}
        className="mt-28"
      />
    </>
  );
};

export default Home;
