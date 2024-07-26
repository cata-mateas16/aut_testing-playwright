export class playwrightPage {
  constructor(page) {
    this.page = page;

    /* todo components */
    this.todoInsertField = page.getByPlaceholder('What needs to be done?');
    this.todoItemList = page.getByTestId('todo-title')
    this.removeTodoItem = page.getByRole('button', { name: 'Delete' });
    this.deleteButton = page.getByRole('button', { name: 'Delete' });
    this.nrOfItemsInTodoList = page.locator('span[data-testid="todo-count"]').nth(0).locator('strong');
    this.checkBoxItem = page.locator('.toggle').first();
    this.activeButton = page.getByRole('link', { name: 'Active' });
    this.completedButton = page.getByRole('link', { name: 'Completed' });
    this.clearCompletedButton = page.getByRole('button', { name: 'Clear completed' });
    this.todoEditItem = page.getByTestId('todo-item');
    this.taskTextBox = page.getByRole('textbox', { name: 'Edit' }); //this is the locator

    /* footer links */
    this.createdByLink = page.getByRole('link', { name: 'Remo H. Jansen' });
    this.partOfLink = page.getByRole('link', { name: 'TodoMVC', exact: true });

    /* header links */
    this.headerLink = page.getByRole('link', { name: 'real TodoMVC app.' });

  }

  async accessPage() {
    await this.page.goto('https://demo.playwright.dev/todomvc');
    await this.page.context().clearCookies();
  }

  async insertItemsInTodoList() {
    const todoList = ['buy coffee', 'wash dishes', 'clean shoes'];
    for (let task of todoList) {
      await this.todoInsertField.fill(task);
      await this.todoInsertField.press('Enter');
    }
  }

  async makeDeleteButtonsVisible() {
    await this.page.evaluate(() => {
      const buttons = document.querySelectorAll('.todo-list li .destroy');
      buttons.forEach(button => {
        button.style.display = 'block';
      });
    }); 
  }

  async clickFirstDeleteButton() {
    await this.makeDeleteButtonsVisible();
    const button = this.deleteButton.first();
    await button.click();
  }

  async enterEditTaskMode() {
    await this.insertItemsInTodoList();
    const task = this.todoEditItem.first();
    await task.dblclick();
  }

  async editTask(text, key) {
    const firstTask = this.todoEditItem.first();
    await firstTask.getByRole('textbox', { name: 'Edit' }).fill(text);
    await firstTask.getByRole('textbox', { name: 'Edit' }).press(key); //dunno how to acces locator other ways ^
  }

  async getTodoItems() {
    const itemCount = await this.todoItemList.count();
    let items = [];
    for(let i = 0; i < itemCount; i++)
      items.push(this.todoEditItem.nth(i));
    return items;
  }

}