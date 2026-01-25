"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download } from "lucide-react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import type { PricelistFile } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function PricelistPage() {
  const firestore = useFirestore();
  const pricelistsQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, "pricelists") : null),
    [firestore]
  );
  const { data: pricelists, isLoading } = useCollection<PricelistFile>(pricelistsQuery);

  const pricelistGroups = React.useMemo(() => {
    if (!pricelists) return [];
    const groups: { brand: string; files: PricelistFile[] }[] = [];
    pricelists.forEach((file) => {
      let group = groups.find((g) => g.brand === file.brand);
      if (!group) {
        group = { brand: file.brand, files: [] };
        groups.push(group);
      }
      group.files.push(file);
    });
    return groups.sort((a,b) => a.brand.localeCompare(b.brand));
  }, [pricelists]);

  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto px-4 py-16 sm:py-24 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline">
            Official Pricelists
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Download our latest product and service pricelists.
          </p>
        </div>

        <div className="space-y-8">
          {isLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle>
                    <Skeleton className="h-8 w-48" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-4 p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-6 w-6" />
                        <div>
                          <Skeleton className="h-5 w-64 mb-2" />
                          <Skeleton className="h-4 w-48" />
                        </div>
                      </div>
                      <Skeleton className="h-10 w-28" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

          {!isLoading &&
            pricelistGroups.map((group) => (
              <Card key={group.brand}>
                <CardHeader>
                  <CardTitle className="text-2xl">{group.brand}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {group.files.map((file) => (
                      <div
                        key={file.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border rounded-lg"
                      >
                        <div className="flex items-start gap-4">
                          <FileText className="h-6 w-6 text-muted-foreground mt-1" />
                          <div>
                            <p className="font-semibold">{file.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {file.fileName}
                            </p>
                          </div>
                        </div>
                        <Button
                          asChild
                          className="w-full sm:w-auto flex-shrink-0"
                        >
                          <a href={file.fileUrl} download={file.fileName} target="_blank" rel="noopener noreferrer">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            {!isLoading && pricelistGroups.length === 0 && (
                <Card>
                    <CardContent className="p-10 text-center text-muted-foreground">
                        No pricelists have been uploaded yet.
                    </CardContent>
                </Card>
            )}
        </div>
      </div>
    </div>
  );
}

    