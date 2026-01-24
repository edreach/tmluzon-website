export default function Footer() {
  return (
    <footer className="bg-secondary/50">
      <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} TMLUZON. All rights reserved.</p>
      </div>
    </footer>
  );
}
