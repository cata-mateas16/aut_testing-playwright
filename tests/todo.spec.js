import {test, expect} from '@playwright/test'
import { playwrightPage } from '../pom/playwrightPage';

test.beforeEach(async ({page}) => {
  let testpage = new playwrightPage(page);
  await testpage.accessPage();
});

test.describe('reachability', () => {
  test('check if URL is correct', async ({page}) => {
    await expect(page).toHaveURL(/playwright/);
  })
  
  test('check if title is correct', async ({page}) => {
    await expect(page).toHaveTitle(/Todo/);
  })
  
  test('check if footer buttons redirect to correct page and have correct text', async({page}) => {
    let testpage = new playwrightPage(page);
  
    await expect(testpage.createdByLink).toHaveText('Remo H. Jansen');
    await testpage.createdByLink.click();
    await expect(page).toHaveURL('https://github.com/remojansen/');
  
    await testpage.accessPage();
  
    await expect(testpage.partOfLink).toHaveText('TodoMVC');
    await testpage.partOfLink.click();
    await expect(page).toHaveURL('https://todomvc.com/');
  })
  
  test('check if header button redirects to correct page and have correct text', async({page}) => {
    let testpage = new playwrightPage(page);
  
    await expect(testpage.headerLink).toHaveText('real TodoMVC app.');
    await testpage.headerLink.click();
    await expect(page).toHaveURL('https://todomvc.com/');
  })
})

test.describe('add and remove tasks', () => {
  test('check if tasks can be added in todo list', async ({page}) => {
    let testpage = new playwrightPage(page); 
    await testpage.insertItemsInTodoList();

    const todoItems = await testpage.getTodoItems();
    for(let item of todoItems)
      await expect(item).toBeVisible();
  }); 
  
  test('check if tasks can be deleted', async ({page}) => {
    let testpage = new playwrightPage(page);
  
    await testpage.insertItemsInTodoList();
    const itemCountBeforeDelete = await testpage.todoItemList.count();
  
    await testpage.clickFirstDeleteButton();
  
    const itemCountAfterDelete = await testpage.todoItemList.count();
    expect(itemCountAfterDelete).toBeLessThan(itemCountBeforeDelete);
  });
})

test.describe('check footer of todo modal', () => {
  test('check nr of items added in todoList', async({page}) => {
    let testpage = new playwrightPage(page);
    await testpage.insertItemsInTodoList();
    
    const taskCounter = await testpage.todoItemList.count();
    const itemsleft = parseInt((await testpage.nrOfItemsInTodoList.textContent()),10);
    
    expect(itemsleft).toBe(taskCounter);
  });
  
  test('check if active section shows correct tasks', async ({page}) => {
    let testpage = new playwrightPage(page);
  
    await testpage.insertItemsInTodoList();
    const allTasksCounter = await testpage.todoItemList.count();
    await testpage.checkBoxItem.check();
    await testpage.activeButton.click();
    const activeTaskCounter = await testpage.todoItemList.count();
    expect(activeTaskCounter).toBeLessThan(allTasksCounter);
  })
  
  test('check if completed section shows correct tasks', async ({page}) => {
    let testpage = new playwrightPage(page);
  
    await testpage.insertItemsInTodoList();
    await testpage.checkBoxItem.check();
    await testpage.completedButton.click();
    const completedTaskCounter = await testpage.todoItemList.count();
    expect(completedTaskCounter).toBe(1);
  })
  
  test('check if clear completed button works', async ({page}) => {
    let testpage = new playwrightPage(page);
  
    await testpage.insertItemsInTodoList();
    const tasksBefore = await testpage.todoItemList.count();
    await testpage.checkBoxItem.check();
    await testpage.clearCompletedButton.click();
    const tasksAfter = await testpage.todoItemList.count();
    expect(tasksAfter).toBeLessThan(tasksBefore);
  })
})

test.describe('editability', () => {
  test('check if task is editable', async({page}) => {
    let testpage = new playwrightPage(page);
  
    const task = testpage.todoEditItem.nth(0);
    await testpage.enterEditTaskMode();
    await expect(task.getByRole('textbox', { name: 'Edit' })).toHaveValue('buy coffee'); //dunno how to use my locator from pom here
    
    await testpage.editTask('testing ..i. out of it','Enter');
    await expect(testpage.todoItemList.nth(0)).toHaveText('testing ..i. out of it');
  })
  
  test('check if removing text from a task also remove task itself', async({page}) => {
    let testpage = new playwrightPage(page);
  
    await testpage.enterEditTaskMode();
    const taskBefore = await testpage.todoItemList.count();
    await testpage.editTask('','Enter'); 
    const taskAfter = await testpage.todoItemList.count();
    expect(taskAfter).toBeLessThan(taskBefore);
  })

  test('check if pressing esc you quit editing', async({page}) => {
    let testpage = new playwrightPage(page);
    await testpage.enterEditTaskMode();
    await testpage.editTask('testing ..i. out of it','Escape');
    
    const todoItems = await testpage.getTodoItems();
    for(let item of todoItems)
      await expect(item).toBeVisible();    
  })
})