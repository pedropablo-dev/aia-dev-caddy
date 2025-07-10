import tkinter as tk
from tkinter import ttk

class App(tk.Tk):
    def __init__(self):
        super().__init__()

        # A- Configuración de la ventana principal
        self.title("Broworks Dev-Caddy")
        self.geometry("800x600")

        # B- Creación del contenedor de pestañas
        self.notebook = ttk.Notebook(self)
        self.notebook.pack(pady=10, padx=10, expand=True, fill="both")

        # C- Placeholder para el contenido (se llenará desde el JSON)
        label_info = ttk.Label(self, text="Inicializando...")
        label_info.pack(padx=10, pady=10)


if __name__ == "__main__":
    app = App()
    app.mainloop()